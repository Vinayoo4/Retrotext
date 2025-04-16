interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Button = ({ active, className = '', ...props }: ButtonProps) => {
  return (
    <button
      className={`px-3 py-2 rounded ${
        active
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
      } ${className}`}
      {...props}
    />
  );
}; 