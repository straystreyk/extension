import { useParams } from "react-router-dom";

export const EditContact = () => {
  const { publicKey } = useParams();

  if (!publicKey) return null;
  return <div>12321123</div>;
};
