const CodeBlock = ({ content }: { content: string }) => {
  return (
    <div className="p-4 rounded-md bg-[#141414] ">
      <p>
        {content.split('\n').map((line, index) => (
          <span key={`content-code-block-${index}`} className="block break-words">
            {line}
          </span>
        ))}
      </p>
    </div>
  )
}

export default CodeBlock
