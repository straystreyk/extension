import { CustomIcon } from "../components/customIcon";
import { useNavigate } from "react-router-dom";

export const InfoPage = () => {
  const navigate = useNavigate();
  return (
    <div className="info-page">
      <div className="page-title-with-back-btn">
        <h2>
          <button onClick={() => navigate(-1)}>
            <CustomIcon icon="arrowLeft" />
          </button>
          Инструкция по&nbsp;использованию
        </h2>
      </div>
      <p>
        На этой странице описаны основные шаги для использования расширения
        Shifronim в браузере Google Chrome. С помощью этого расширения, вы
        сможете обмениваться зашифрованными сообщениями с вашими контактами для
        обеспечения безопасной и конфиденциальной коммуникации.
      </p>
      <div className="info-title">Создание контакта</div>
      <p>
        Для того, чтобы создать контакт, вам необходимо обменяться секретным
        ключом с собеседником, либо зашифрованным словом. Первоначально нажмите
        на кнопку «Создать контакт», которая находится на Главной странице и
        выполните следующие шаги:
      </p>
      <p>
        Шаг 1: Введите имя контакта, которого хотели бы добавить и нажмите
        кнопку «Далее».
      </p>
      <p>
        Шаг 2: Установите связь по обмену публичным ключом. Выберете каким
        способом вы планируете установить связь и нажмите кнопку «Далее». Здесь
        вы можете установить связь двумя способами:
      </p>
      <p>
        Как ОТПРАВИТЕЛЬ – пользователь, который отправляет свой ключ для
        генерации секретного слова своему собеседнику. То есть вы отправляете
        свой ключ собеседнику, а он в ответном письме присылает вам
        зашифрованное сообщение для создания контакта. Как ПОЛУЧАТЕЛЬ –
        пользователь, который получает секретный ключ и зашифровывает слово.
      </p>
      <h3>Если вы выбрали установку связи, как ОТПРАВИТЕЛЬ:</h3>
      <p>
        Шаг 3: Скопируйте свой ключ, нажав на кнопку и перешлите его
        собеседнику, нажмите кнопку «Далее». Внимание: для пересылки ключа не
        рекомендуется использовать тот же мессенджер, в котором ведется
        переписка!
      </p>
      <p>
        Шаг 4: Введите полученное от собеседника зашифрованное сообщение и
        нажмите кнопку «Готово». Далее ваш новый контакт появится в «Списке
        контактов», где можете выбрать контакт и включить Shifronim при помощи
        кнопки{" "}
        <button className="info-page-btn-on">
          <CustomIcon icon="on" />
        </button>
      </p>
      <h3>Если вы выбрали установку связи, как ПОЛУЧАТЕЛЬ:</h3>
      <p>
        Шаг 3: Вставьте публичный ключ, полученный от собеседника и нажмите
        кнопку «Далее». Для этого вам необходимо запросить публичный ключ у
        вашего собеседника. Внимание: для пересылки ключа не рекомендуется
        использовать тот же мессенджер, в котором ведется переписка!
      </p>
      <p>
        Шаг 4: Скопируйте и отправьте зашифрованный текст собеседнику. После
        отправки нажмите кнопку Готово. Далее ваш новый контакт появится в
        «Списке контактов», где можете выбрать контакт и включить Shifronim при
        помощи кнопки{" "}
        <button className="info-page-btn-on">
          <CustomIcon icon="on" />
        </button>
      </p>
      <div className="info-title">Отправка и расшифровка сообщения</div>
      <p>
        После того, как вы выбрали контакт и включили Shifronim, на веб-странице
        вы увидите текстовое поле.
      </p>
      <p>
        Введите текст, который хотите отправить собеседнику, и нажмите кнопку
        «Зашифровать». Зашифрованное сообщение запишется в буфер обмена.
      </p>
      <p>
        Вставьте зашифрованное сообщение в мессенджер и отправьте собеседнику.
        Зашифрованные сообщения будут переводиться автоматически пока включено
        расширение.
      </p>
    </div>
  );
};
