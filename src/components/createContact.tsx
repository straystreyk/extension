import { useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, memo, useState } from "react";
import { CustomIcon } from "./customIcon";
import { useCreateContact } from "../hooks/contacts";

export const initialFormState = {
  id: "",
  name: "",
  prefix: "",
  secretWord: "",
};

export const CreateContact = memo(() => {
  const navigate = useNavigate();
  const { handleCreate: create } = useCreateContact();
  const [formState, setFormState] = useState(initialFormState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await create(formState.name, formState.secretWord, "prefix12333");
    setFormState(initialFormState);
  };

  return (
    <>
      <div className="page-title-with-back-btn">
        <h2>
          <button onClick={() => navigate(-1)}>
            <CustomIcon icon="arrowLeft" />
          </button>
          Создание контакта
        </h2>
      </div>
      <form onSubmit={handleCreate} className="create-contacts">
        <div className="label-input-wrapper">
          <label>Имя контакта</label>
          <input
            name="name"
            value={formState.name}
            required
            placeholder="Имя контакта"
            onChange={handleChange}
          />
        </div>
        <div className="label-input-wrapper">
          <label>Публичный ключ контакта</label>
          <input
            name="prefix"
            value={formState.prefix}
            required
            placeholder="Публичный ключ контакта"
            onChange={handleChange}
          />
        </div>
        <div className="label-input-wrapper">
          <label>Секретное слово для шифрования</label>
          <input
            name="secretWord"
            value={formState.secretWord}
            required
            placeholder="Секретное слово для шифрования"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Создать</button>
      </form>
    </>
  );
});
