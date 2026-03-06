const Button = (content : string) => {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {content}
    </button>
  )
}

export default Button;