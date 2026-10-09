// Runs once in the main process, before the test workers start.
// Pinning a non-UTC timezone makes date tests deterministic and catches
// "UTC vs local date" bugs that would otherwise hide on a UTC machine/CI runner.
export default function setup() {
  process.env.TZ = 'America/Los_Angeles';
}
