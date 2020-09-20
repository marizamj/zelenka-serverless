export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://zelenka.online"
];

const fields = {
  name: "Как вас зовут?",
  email: "Контактный e-mail",
  phone: "Телефон",
  workplace: "Где вы работаете? Не забудьте адрес сайта.",
  message: "О чем вы хотели бы рассказать в Зелёнке?",
  money: "Сколько денег вы готовы потратить на спонсорский выпуск?",
  startDate: "Когда хотите начать?",
  messageall: "Ваша идея/предложение",
  compliments: "Чем вам нравится Зелёнка?",
  recommendations: "Что нам необходимо улучшить в своей работе?"
};

const isKnownField = (name: string): name is keyof typeof fields =>
  Object.keys(fields).includes(name);

const getHeader = (name: string) => {
  if (isKnownField(name)) {
    return fields[name];
  }
  throw new Error("Unknown field.");
};

export const getEmailBodyHtml = (body: Record<string, string>) =>
  Object.entries(body).reduce(
    (res, [key, val]) =>
      res + "<h3>" + getHeader(key) + "</h3><p>" + val + "</p>",
    ""
  );

export const normalizeHeaders = (headers: Record<string, string>) =>
  Object.entries(headers).reduce<Record<string, string>>(
    (acc, [key, value]) => ({ ...acc, [key.toLowerCase()]: value }),
    {}
  );
