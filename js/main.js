// Функционал перемещения по карточка, вперед и назад
// Проверка на ввод данных
// Получение(сбор) данных с карточек
// Записывать все введённые данные
// Реализовать работу прогресс-бара
// Подсветка рамки для радио и чекбоксов

const btnNext = document.querySelectorAll("[data-nav='next']");
const btnPrev = document.querySelectorAll("[data-nav='prev']");

// Объект с сохранёнными ответами

const answers = {
  2: null,
  3: null,
  4: null,
  5: null
}

// движение вперед
btnNext.forEach(function(button) {
  button.addEventListener("click", function() {
    const thisCard = this.closest("[data-card]");
    const thisCardNumber = +thisCard.dataset.card;

    if (thisCard.dataset.validate === "novalidate") {
      navigate("next", thisCard);
      upgradeProgressBarr("next",thisCardNumber);
    } else {
      // При движении вперёд сохраняем данные в объект
      saveAnswer(thisCardNumber, gathercardData(thisCardNumber));
      // Валидация на заполненность
      if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
        navigate("next", thisCard);
        upgradeProgressBarr("next",thisCardNumber);
      } else {
        alert("Сделайте ответ, прежде чем переходить далее.");
      }
    }
  });

  // Движение назад
  btnPrev.forEach(function(button) {
    button.addEventListener("click", function() {
      const thisCard = this.closest("[data-card]");
      const thisCardNumber = +thisCard.dataset.card;
      navigate("prev", thisCard);
      upgradeProgressBarr("prev", thisCardNumber);
    });
  });
});

// Функция для навигации вперд и назад

function navigate(direction, thisCard) {
  const thisCardNumber = +thisCard.dataset.card;
  let nextCard;
  if (direction === "prev") {
    nextCard = thisCardNumber - 1;
  } else {
    nextCard = thisCardNumber + 1;
  }
  thisCard.classList.add("hidden");
  document.querySelector(`[data-card='${nextCard}']`).classList.remove("hidden");
}

// Функция сбора заполненных данных с карточки

function gathercardData(number) {
  let question;
  let result = [];

  // Находим карточку по номеру и дата-атрибуту
  const currentCard = document.querySelector(`[data-card='${number}']`);
  // Находим главный вопрос карточки
  question = currentCard.querySelector("[data-question]").innerText;
  // Находим все заполненные значения из радио кнопок
  const radioValues = currentCard.querySelectorAll("[type='radio']");
  radioValues.forEach(function(item) {
    if (item.checked) {
      result.push({
        name: item.name,
        value: item.value
      });
    }
  });
  // Находим все заполненные значения из чекбоксов
  const checkBoxValues = currentCard.querySelectorAll("[type='checkbox']");
  checkBoxValues.forEach(function(item) {
    if (item.checked) {
      result.push({
        name: item.name,
        value: item.value
      });
    }
  });
  // Находим все заполненные значения из инпутов
  const inputValues = currentCard.querySelectorAll("[type='text'], [type='email'], [type='number']");
  inputValues.forEach(function(item) {
    itemValue = item.value;
    if (itemValue.trim() !== "") {
      result.push({
        name: item.name,
        value: item.value
      });
    }
  });

  const data = {
    question: question,
    answer: result
  };

  return data;
}

// Функция записи ответа в объект с ответами
function saveAnswer(number, data) {
  answers[number] = data;
}

// Функция проверки на заполненность
function isFilled(number) {
  if (answers[number].answer.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Функция для проверки email
function validateEmail(email) {
  const pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
  return pattern.test(email);
}

// Проверка на заполненность required чекбоксов и инпутов с email
function checkOnRequired(number) {
  const currentCard = document.querySelector(`[data-card='${number}']`);
  const requiredFields = currentCard.querySelectorAll("[required]");
  const isValidArray = [];

  requiredFields.forEach(function(item) {
    if (item.type === "checkbox" && item.checked === false) {
      isValidArray.push(false);
    } else if (item.type === "email") {
      if (validateEmail(item.value)) {
        isValidArray.push(true);
      } else {
        isValidArray.push(false);
      }
    }
  });

  if (isValidArray.indexOf(false) === -1) {
    return true;
  } else {
    return false;
  }
}

// Подсвечиваем рамку у радиокнопок
document.querySelectorAll(".radio-group").forEach(function(item) {
  item.addEventListener("click", function(e) {
    // Проверяем где произошёл клик, внутри тэга label или нет
    const label = e.target.closest("label");
    if (label) {
      // Отменяем активный класс у всех тэгов label
      label.closest(".radio-group").querySelectorAll("label").forEach(function(item) {
        item.classList.remove("radio-block--active");
      });
    }
    // Добавляем активный класс к label по которому был клик
    label.classList.add("radio-block--active");
  });
});

// Подсвечиваем рамку у чекбоксов
document.querySelectorAll("label.checkbox-block input[type='checkbox']").forEach(function(item) {
  item.addEventListener("change", function() {
    // Если чекбокс проставлен, то
    if (item.checked) {
      // Добавляем активный  класс к тэгу label в котором он лежит
      item.closest("label").classList.add("checkbox-block--active");
    } else {
      // в ином случае убираем активный класс
      item.closest("label").classList.remove("checkbox-block--active");
    }
  });
});

// Отображение прогресс бара
function upgradeProgressBarr(direction, cardNumber) {
  // Расчёт всего кол-ва карточек
  const cardsTotalNumber = document.querySelectorAll("[data-card]").length;
  // Текущая карточка
  // Проверка направления перемещения
  if (direction === "next") {
    cardNumber = cardNumber + 1;
  } else if(direction === "prev") {
    cardNumber = cardNumber - 1;
  }
  // Рачёт % прохождения
  const progress = ((cardNumber * 100) / cardsTotalNumber).toFixed();
  // Находим и обновляем прогресс бар
  const progressBar = document.querySelector(`[data-card='${cardNumber}']`).querySelector(".progress");
  if (progressBar) {
    // Обновить число прогресс бара
    progressBar.querySelector(".progress__label strong").innerText = `${progress}%`;
    // Обновить полоску прогресс бара
    progressBar.querySelector(".progress__line-bar").style = `width: ${progress}%`;
  }
}


