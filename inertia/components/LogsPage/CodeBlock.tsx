const CodeBlock = ({ content }: { content: string }) => {
  // Try to parse content as JSON
  let isJson = false
  let formattedJson = ''

  try {
    const parsedJson = JSON.parse(content)
    formattedJson = JSON.stringify(parsedJson, null, 2)
    isJson = true
  } catch (e) {
    // Not valid JSON, will use the original content
  }

  // Function to colorize JSON syntax
  const colorizeJson = (text: string) => {
    // Replace values with colored spans
    return text
      .replace(
        /(".*?"): (".*?")/g,
        '<span class="text-blue-300">$1</span>: <span class="text-green-300">$2</span>'
      )
      .replace(
        /(".*?"): (true|false|null)/g,
        '<span class="text-blue-300">$1</span>: <span class="text-yellow-300">$2</span>'
      )
      .replace(
        /(".*?"): (\d+)/g,
        '<span class="text-blue-300">$1</span>: <span class="text-purple-300">$2</span>'
      )
      .replace(/([{}\[\]])/g, '<span class="text-gray-400">$1</span>')
  }


  return (
     <div className="p-4 rounded-md bg-[#141414] font-mono text-white">
      <p>
      {isJson
          ? formattedJson
              .split('\n')
              .map((line, index) => (
                <span
                  key={`content-code-block-${index}`}
                  className="block break-words"
                  dangerouslySetInnerHTML={{ __html: colorizeJson(line) }}
                />
              ))
          : content.split('\n').map((line, index) => (
              <span key={`content-code-block-${index}`} className="block break-words">
                {line}
              </span>
        ))}
      </p>
    </div>
  )
}

export default CodeBlock
