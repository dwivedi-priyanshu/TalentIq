// Judge0 CE API is a service for code execution

const JUDGE0_API = "https://ce.judge0.com";

const JUDGE0_LANGUAGE_IDS = {
  javascript: 97, // Node.js 20.17.0
  python: 100,    // Python 3.12.5
  java: 91,       // Java JDK 17.0.6
};

/**
 * @param {string} language - programming language
 * @param {string} code - source code to execute
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const languageId = JUDGE0_LANGUAGE_IDS[language];

    if (!languageId) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    // Java files must have class name 'Main' to compile/run correctly on Judge0 CE
    if (language === "java") {
      code = code.replace(/\bclass\s+Solution\b/g, "class Main");
    }

    const response = await fetch(`${JUDGE0_API}/submissions?wait=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: code,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();

    // Judge0 CE response handling
    if (data.status.id === 6) {
      // Compilation Error
      return {
        success: false,
        output: "",
        error: data.compile_output || "Compilation Error",
      };
    }

    if (data.status.id !== 3) {
      // Any other error (Runtime Error, Time Limit Exceeded, etc.)
      return {
        success: false,
        output: data.stdout || "",
        error: data.stderr || data.message || "Execution Error",
      };
    }

    return {
      success: true,
      output: data.stdout || "No output",
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
    };
  }
}

