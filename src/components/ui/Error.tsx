interface ErrorProps {
  msg?: string
}

const Error: React.FC<ErrorProps> = ({ msg = 'Something is wrong!' }) => (
  <small className='text-danger' role='alert'>
    {msg}
  </small>
)

export default Error
