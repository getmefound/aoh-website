import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const DEFAULT_SCENARIO_PATH = "docs/agentops/manager-eval-scenarios.json";
const DEFAULT_OUT_DIR = ".tmp_agent_evals";
const DEFAULT_REPORT_DIR = "docs/client-ops-ledger/outbox";

main();

function main() {
  const args = parseArgs(process.argv.slice(2));
  const scenarioPath = String(args.file ?? args.scenarios ?? DEFAULT_SCENARIO_PATH);
  const data = readJson(scenarioPath);
  const scenarios = Array.isArray(data.scenarios) ? data.scenarios : [];

  if (args.list) {
    for (const scenario of scenarios) {
      console.log(`${scenario.id}: ${scenario.command}`);
    }
    return;
  }

  const selectedIds = String(args.scenario ?? args.id ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const selected = selectedIds.length
    ? scenarios.filter((scenario) => selectedIds.includes(String(scenario.id)))
    : scenarios;

  if (!selected.length) {
    console.error("No Manager eval scenarios selected.");
    process.exit(1);
  }

  const outDir = String(args.outDir ?? args["out-dir"] ?? DEFAULT_OUT_DIR);
  mkdirSync(outDir, { recursive: true });

  const results = selected.map((scenario) => runScenario(scenario, outDir));
  const failed = results.filter((result) => !result.passed);
  const reportPath = writeReport(results, {
    reportDir: String(args.reportDir ?? args["report-dir"] ?? DEFAULT_REPORT_DIR),
    scenarioPath,
  });

  for (const result of results) {
    const mark = result.passed ? "PASS" : "FAIL";
    console.log(`${mark} ${result.id} - ${result.command}`);
    for (const check of result.checks.filter((item) => !item.passed)) {
      console.log(`  - ${check.label}`);
    }
  }

  console.log("");
  console.log(`Manager eval report: ${reportPath}`);

  if (failed.length) {
    console.error(`${failed.length} Manager eval scenario(s) failed.`);
    process.exit(1);
  }

  console.log(`All ${results.length} Manager eval scenario(s) passed.`);
}

function runScenario(scenario, outDir) {
  const command = String(scenario.command ?? "").trim();
  const id = String(scenario.id ?? command).trim();
  const child = spawnSync(process.execPath, ["scripts/agent-command-center.mjs", "--command", command, "--outDir", outDir], {
    cwd: process.cwd(),
    env: { ...process.env, AGENT_EVAL_MODE: "1" },
    encoding: "utf8",
    shell: false,
  });

  const output = `${child.stdout ?? ""}\n${child.stderr ?? ""}`;
  const checks = [];

  checks.push({
    type: "exit_code",
    expected: "0",
    passed: child.status === 0,
    label: `command exited with ${child.status ?? "unknown"}`,
  });

  for (const value of asArray(scenario.must_include)) {
    checks.push({
      type: "must_include",
      expected: value,
      passed: includesLoose(output, value),
      label: `missing required text: ${value}`,
    });
  }

  for (const value of asArray(scenario.must_not_include)) {
    checks.push({
      type: "must_not_include",
      expected: value,
      passed: !includesLoose(output, value),
      label: `forbidden text present: ${value}`,
    });
  }

  return {
    id,
    command,
    intent: scenario.intent ?? "",
    passed: checks.every((check) => check.passed),
    checks,
  };
}

function writeReport(results, { reportDir, scenarioPath }) {
  mkdirSync(reportDir, { recursive: true });
  const stamp = timestamp();
  const reportPath = path.join(reportDir, `manager-agent-eval-${stamp}.md`);
  const passed = results.filter((result) => result.passed).length;
  const lines = [];

  lines.push(`# Manager Agent Eval - ${stamp}`);
  lines.push("");
  lines.push(`Scenarios: ${results.length}`);
  lines.push(`Passed: ${passed}`);
  lines.push(`Failed: ${results.length - passed}`);
  lines.push(`Scenario file: \`${scenarioPath}\``);
  lines.push("");
  lines.push("| Scenario | Intent | Result | Command |");
  lines.push("|---|---|---|---|");
  for (const result of results) {
    lines.push(
      `| ${escapeTable(result.id)} | ${escapeTable(result.intent || "")} | ${result.passed ? "PASS" : "FAIL"} | \`${escapeBackticks(result.command)}\` |`,
    );
  }

  const failed = results.filter((result) => !result.passed);
  if (failed.length) {
    lines.push("");
    lines.push("## Failed Checks");
    for (const result of failed) {
      lines.push("");
      lines.push(`### ${result.id}`);
      for (const check of result.checks.filter((item) => !item.passed)) {
        lines.push(`- ${check.label}`);
      }
    }
  }

  writeFileSync(reportPath, `${lines.join("\n")}\n`);
  return reportPath;
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    console.error(`Scenario file not found: ${filePath}`);
    process.exit(1);
  }

  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`Unable to parse scenario file: ${filePath}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

function asArray(value) {
  return Array.isArray(value) ? value.map(String) : [];
}

function includesLoose(source, expected) {
  return source.toLowerCase().includes(String(expected).toLowerCase());
}

function timestamp() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}-${get("minute")}-${get("second")}`;
}

function escapeTable(value) {
  return String(value).replaceAll("|", "\\|");
}

function escapeBackticks(value) {
  return String(value).replaceAll("`", "\\`");
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

