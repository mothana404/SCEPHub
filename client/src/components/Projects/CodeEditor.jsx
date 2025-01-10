import React, { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPlay, FaCode, FaTerminal, FaSpinner } from 'react-icons/fa';
import { BiLoaderAlt } from 'react-icons/bi';

function CodeEditor() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const languages = [
    { name: 'JavaScript', value: 'javascript', apiLang: '63' },
    { name: 'Python', value: 'python', apiLang: '71' },
    { name: 'C++', value: 'cpp', apiLang: '76' },
    { name: 'Java', value: 'java', apiLang: '62' },
  ];


  const codeTemplates = {
    javascript: `
class Example {
  constructor() {
    this.message = "Hello, JavaScript!";
  }
  greet() {
    return this.message;
  }
}

const example = new Example();
console.log(example.greet());
`,
    python: `
class Example:
    def __init__(self):
        self.message = "Hello, Python!"
    
    def greet(self):
        return self.message

example = Example()
print(example.greet())
`,
    cpp: `
#include <iostream>
#include <string>

class Example {
public:
    Example() : message("Hello, C++!") {}
    
    std::string greet() const {
        return message;
    }

private:
    std::string message;
};

int main() {
    Example example;
    std::cout << example.greet() << std::endl;
    return 0;
}
`,
    java: `
public class Example {
    private String message = "Hello, Java!";
    
    public String greet() {
        return message;
    }

    public static void main(String[] args) {
        Example example = new Example();
        System.out.println(example.greet());
    }
}
`,
  };

  const getLanguageId = () => languages.find((lang) => lang.value === language)?.apiLang;

  useEffect(() => {
    // Set the code template based on the selected language
    setCode(codeTemplates[language]);
  }, [language]);

  const handleRunCode = async () => {
    setLoading(true);
    setOutput('');
    try {
      const response = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions?fields=*',
        {
          source_code: code,
          language_id: getLanguageId(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-key': '11671a06f3msh629f9fa5104a64bp1ad307jsnffa2d70c18db',
          },
        }
      );

      const { token } = response.data;
      let result = null;
      while (!result) {
        const resultResponse = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}?fields=*`,
          {
            headers: {
              'x-rapidapi-key': '11671a06f3msh629f9fa5104a64bp1ad307jsnffa2d70c18db',
            },
          }
        );

        if (resultResponse.data.status.id > 2) {
          result = resultResponse.data;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      setOutput(result.stdout || result.stderr || 'No output');
    } catch (error) {
      setOutput('Error executing code.');
      console.error('Execution error:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4 items-center">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                >
                    {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleRunCode}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                >
                    {loading ? (
                        <FaSpinner className="animate-spin mr-2" />
                    ) : (
                        <FaPlay className="mr-2" />
                    )}
                    Run Code
                </button>
            </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="border rounded-lg overflow-hidden">
                <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value)}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                    }}
                />
            </div>
            <div className="border rounded-lg bg-gray-900 p-4 overflow-auto">
                <pre className="text-white font-mono text-sm">
                    {output || 'Output will appear here...'}
                </pre>
            </div>
        </div>
    </div>
);
}

export default CodeEditor;