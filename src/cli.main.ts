import * as readline from "readline";
import { deepResearchAgent } from "./agents/deep-research";

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a proper question function that returns the user's input
const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};

// Preset deep research prompts
const presetPrompts = [
  {
    id: 1,
    title: "Climate Change Impact Analysis",
    prompt:
      "Conduct a comprehensive analysis of climate change impacts on global agriculture, including regional variations, adaptation strategies, and economic implications over the next 20 years.",
  },
  {
    id: 2,
    title: "AI Ethics in Healthcare",
    prompt:
      "Research the current state of AI ethics in healthcare applications, examining regulatory frameworks, privacy concerns, bias issues, and recommendations for responsible AI deployment in medical settings.",
  },
  {
    id: 3,
    title: "Renewable Energy Economics",
    prompt:
      "Analyze the economic viability of different renewable energy technologies, comparing costs, efficiency, scalability, and policy support across major global markets.",
  },
  {
    id: 4,
    title: "Future of Remote Work",
    prompt:
      "Investigate the long-term implications of remote work on urban planning, real estate markets, social dynamics, and corporate culture, with predictions for the next decade.",
  },
  {
    id: 5,
    title: "Quantum Computing Applications",
    prompt:
      "Research practical applications of quantum computing across industries, current limitations, timeline for commercial viability, and potential societal impacts.",
  },
];

async function displayMenu(): Promise<void> {
  console.log("\n🔍 Deep Research CLI");
  console.log("=".repeat(50));
  console.log("\nSelect an option:");
  console.log("0. Enter custom research prompt");

  presetPrompts.forEach((prompt) => {
    console.log(`${prompt.id}. ${prompt.title}`);
  });

  console.log("\n" + "-".repeat(50));
}

async function displayPromptDetails(
  prompt: (typeof presetPrompts)[0]
): Promise<void> {
  console.log(`\n📋 ${prompt.title}`);
  console.log("-".repeat(50));
  console.log(`${prompt.prompt}\n`);
}

async function getUserChoice(): Promise<number> {
  while (true) {
    try {
      const input = await question("Enter your choice (0-5): ");
      const choice = parseInt(input.trim());

      if (choice >= 0 && choice <= presetPrompts.length) {
        return choice;
      } else {
        console.log(
          `❌ Invalid choice. Please enter a number between 0 and ${presetPrompts.length}.`
        );
      }
    } catch (error) {
      console.log("❌ Invalid input. Please enter a number.");
    }
  }
}

async function getCustomPrompt(): Promise<string> {
  console.log("\n✏️  Enter your custom research prompt:");
  console.log("-".repeat(50));

  let prompt = "";
  while (!prompt.trim()) {
    prompt = await question("> ");
    if (!prompt.trim()) {
      console.log(
        "❌ Prompt cannot be empty. Please enter a valid research prompt."
      );
    }
  }

  return prompt.trim();
}

async function confirmPrompt(prompt: string): Promise<boolean> {
  console.log("\n📝 Research prompt to execute:");
  console.log("-".repeat(50));
  console.log(`"${prompt}"`);
  console.log("-".repeat(50));

  const confirmation = await question("\nProceed with this research? (y/N): ");
  return confirmation.toLowerCase().startsWith("y");
}

function prettifyJSON(obj: any): string {
  return JSON.stringify(obj, null, 2);
}

async function executeResearch(message: string): Promise<void> {
  console.log("\n🔄 Executing deep research workflow...");
  console.log("This may take several minutes...\n");

  try {
    const startTime = Date.now();
    const result = await deepResearchAgent.run({ message }, {});
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log("✅ Research completed successfully!");
    console.log(`⏱️  Execution time: ${duration.toFixed(2)} seconds\n`);
    console.log("📊 Research Results:");
    console.log("=".repeat(50));
    console.log(prettifyJSON(result));
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Error during research execution:");
    console.error(error);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  console.log("Welcome to the Deep Research CLI! 🚀");

  try {
    while (true) {
      await displayMenu();
      const choice = await getUserChoice();

      let researchPrompt: string;

      if (choice === 0) {
        // Custom prompt
        researchPrompt = await getCustomPrompt();
      } else {
        // Preset prompt
        const selectedPrompt = presetPrompts[choice - 1];
        await displayPromptDetails(selectedPrompt);
        researchPrompt = selectedPrompt.prompt;
      }

      // Confirm before executing
      const confirmed = await confirmPrompt(researchPrompt);

      if (confirmed) {
        await executeResearch(researchPrompt);
        break;
      } else {
        console.log("\n❌ Research cancelled. Returning to menu...");
        continue;
      }
    }
  } catch (error) {
    console.error("❌ An unexpected error occurred:", error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n👋 Goodbye!");
  rl.close();
  process.exit(0);
});

// Run the CLI
if (require.main === module) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { main };
