import checkNum from './checkNumInput';

const forms = (state) => {
    //получаем все формы и инпуты
    const form = document.querySelectorAll('form'),
          inputs = document.querySelectorAll('input');

    checkNum('input[name="user_phone"]');

    //создаем сообщения
    const message = {
        loading: 'Загрузка...',
        succes: 'Спасибо, скоро с Вами свяжутся',
        error: 'Что-то пошло не так'
    };

    //ф-ция отправки данных
    const postData = async (url, data) => {
        document.querySelector('.status').textContent = message.loading;
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });

        return await res.text();
    };

    //ф-ция очистки инпутов
    const clearInputs = () => {
        inputs.forEach(item => {
            item.value = '';
        });
    };

    form.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();

            //создаем блок со статусом отправки
            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            item.appendChild(statusMessage);

            //собираем введенные данные с формы 
            const formData = new FormData(item);
            if(item.getAttribute('data-calc') === "end") {
                for(let key in state) {
                    formData.append(key, state[key]);
                }
            }

            //отправляем запрос на сервер
            postData('assets/server.php', formData)
                .then(res => {
                    console.log(res);
                    statusMessage.textContent = message.succes;
                })
                .catch(() => statusMessage.textContent = message.failure)
                .finally(() => {
                    clearInputs();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 5000);
                    for(let key in state) {
                        if(key === 'form') {
                            state[key] = 0;
                        }
                        if(key === 'type') {
                            state[key] = 'tree';
                        }else {
                            delete state[key];
                        }            
                    }
                });
        });
    });
};

export default forms;