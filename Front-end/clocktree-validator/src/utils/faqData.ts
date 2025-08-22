// src/utils/faqData.ts
export const faq = [
  // General usage
  {
    question: "How do I validate a JSON file?",
    keywords: ["validate", "validation", "json", "how"],
    answer: "Click the 'Validate' button after selecting your JSON file. You can also validate multiple files by selecting a folder."
  },
  {
    question: "Can I validate multiple files at once?",
    keywords: ["multiple files", "batch", "folder", "multiple", "validate"],
    answer: "Yes, use the 'Select a folder' button to validate all JSON files in a folder in one operation."
  },
  {
    question: "How can I view the history of file modifications?",
    keywords: ["history", "modifications", "file", "history"],
    answer: "Use the history feature to view previous versions of your file. Click the history icon or go to the 'History' section."
  },
  {
    question: "Where can I find the JSON schema documentation?",
    keywords: ["documentation", "schema", "json", "doc"],
    answer: "The schema documentation is available in the 'Help' section of the application or via the link provided in the chatbot."
  },
  {
    question: "How can I get help or contact support?",
    keywords: ["help", "support", "contact", "assistance"],
    answer: "Click the 'Contact support' button in the chatbot or send an email to support@your-company.com."
  },

  // JSON schema errors
  {
    question: "What does the 'missing required property' error mean?",
    keywords: ["required property", "missing", "error", "required", "missing property"],
    answer: "This means a required property is missing from your file. Check the schema and add the missing property at the indicated location."
  },
  {
    question: "What should I do if I get an invalid type error?",
    keywords: ["invalid type", "type error", "type"],
    answer: "The value type does not match the expected schema (e.g., string, number, boolean). Correct the value to match the expected type."
  },
  {
    question: "How do I fix the 'additional property not allowed' error?",
    keywords: ["additional property", "not allowed", "error"],
    answer: "Your file contains a property not defined in the schema. Remove or correct this property."
  },
  {
    question: "What does the 'invalid enum value' error mean?",
    keywords: ["enum", "invalid value", "error", "allowed value"],
    answer: "The provided value is not among the allowed values. Check the schema documentation for accepted values."
  },
  {
    question: "How do I fix a 'const' error?",
    keywords: ["const", "constant value", "error", "must be exactly"],
    answer: "The value of this field must be exactly as expected by the schema. Change the value to match the defined constant."
  },
  {
    question: "What should I do if I get an 'invalid structure' error?",
    keywords: ["invalid structure", "structure error"],
    answer: "Your file does not match the expected schema structure. Make sure all required fields are present and properly structured."
  },
  {
    question: "What does the 'invalid date format' error mean?",
    keywords: ["date", "date format", "invalid", "error"],
    answer: "The date format must be YYYY-MM-DD. Correct the value to match this format."
  },

  // Custom validator errors
  {
    question: "How do I fix the 'duplicate element id' error?",
    keywords: ["duplicate id", "element duplicate", "error"],
    answer: "Two or more elements have the same identifier. Change the IDs so they are unique in the file."
  },
  {
    question: "What if the 'transitions' section is missing?",
    keywords: ["transitions missing", "transitions section", "error"],
    answer: "The 'transitions' section is required in the JSON file. Add it according to the expected schema."
  },
  {
    question: "What does the error 'tree.transitions must be an array' mean?",
    keywords: ["tree.transitions", "must be an array", "error", "transitions"],
    answer: "'tree.transitions' must be an array. Check your JSON structure."
  },
  {
    question: "How do I fix the 'duplicate transition id' error?",
    keywords: ["duplicate transition id", "transition duplicate", "error"],
    answer: "Two or more transitions have the same identifier. Change the IDs so they are unique."
  },
  {
    question: "What does the error 'unexpected multiplexor outgoing transition' mean?",
    keywords: ["multiplexor", "outgoing transition", "unexpected", "error"],
    answer: "Check the configuration of transitions for this multiplexor. Outgoing transitions must match the entries defined in 'possible_Input'."
  },
  {
    question: "What if a multiplexor transition does not have the correct format?",
    keywords: ["multiplexor", "transition", "format", "input_Id", "from", "error"],
    answer: "The expected format is '<input_Id>__<from>_input'. Correct the value to match this format."
  },
  {
    question: "What does the error 'transition does not match any input_Id/from pair of the multiplexor' mean?",
    keywords: ["multiplexor", "transition", "input_Id", "from", "error"],
    answer: "The transition must point to an existing input_Id/from pair in the multiplexor's 'possible_Input'."
  },
  {
    question: "What if an expected multiplexor transition is missing?",
    keywords: ["multiplexor", "expected transition", "missing", "error"],
    answer: "Add the missing outgoing transition for each entry defined in the multiplexor's 'possible_Input'."
  },
  {
    question: "What if there is an extra outgoing multiplexor transition?",
    keywords: ["multiplexor", "outgoing transition", "extra", "error"],
    answer: "Remove outgoing transitions that do not match an entry defined in 'possible_Input'."
  },

  // Transition errors
  {
    question: "What does the error 'duplicate transition id found' mean?",
    keywords: ["duplicate transition id", "transition duplicate", "error"],
    answer: "Two or more transitions have the same identifier. Change the IDs so they are unique."
  },
  {
    question: "What if I get an error on 'transitionRoutingPoint'?",
    keywords: ["transitionRoutingPoint", "error", "point", "routing"],
    answer: "Check that each 'transitionRoutingPoint' contains the fields 'kind', 'x', 'y', and 'pointIndex', and that 'kind' is one of the allowed values ('linear', 'bezier', 'arc')."
  },

  // Element errors
  {
    question: "What does the error 'unit.text has an invalid value' mean?",
    keywords: ["unit.text", "invalid value", "MHz", "KHz", "error"],
    answer: "The 'unit.text' field must be 'MHz' or 'KHz' as per the schema. Correct the value."
  },
  {
    question: "What if I get an error on 'oneOf'?",
    keywords: ["oneOf", "error", "discreteValuesSource", "distinctFrequencieOscillator", "divider"],
    answer: "Elements of type 'discreteValuesSource', 'distinctFrequencieOscillator', or 'divider' must have the 'oneOf' field properly filled."
  },
  {
    question: "What does an error on 'default' mean?",
    keywords: ["default", "error", "default value"],
    answer: "The 'default' field must be of the expected type depending on the context (number or string). Check the schema for the expected type."
  },
  {
    question: "What if I get an error on 'size', 'min', 'max', 'outOfRange', 'fracDivisor', or 'multiplicatorFactor'?",
    keywords: ["size", "min", "max", "outOfRange", "fracDivisor", "multiplicatorFactor", "error"],
    answer: "Check that all these fields are present and properly filled for elements of type 'fractionalValue' or 'rectangularShape'."
  },

  // Parsing errors
  {
    question: "What should I do if I get a JSON parsing error?",
    keywords: ["parsing", "error", "read", "json", "parse"],
    answer: "Your JSON file is malformed. Check the syntax (commas, brackets, braces, quotes, etc.)."
  }
];