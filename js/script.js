import conditions from "/js/conditions.js"

const apiKey = '7ce2ef265d674b8eaf7123318231509';



const header = document.querySelector('.header')
const form = document.querySelector('#form');
const input = document.querySelector('#input-city');


function removeCard(){
    const prevCard = document.querySelector('.card');
    if(prevCard) prevCard.remove();
}
function showError(errorMessage){
    const html = `<div class="card">${errorMessage}</div>`;
    header.insertAdjacentHTML('afterend',html);
}
function showCard({name,country,temp,condition,imgPath}){
    const html = `<div class="card">
                                    <h2 class="card-city">${name} <span>${country}</span></h2>

                                    <div class="card-weather">
                                    <div class="card-value">${temp}<sup>°c</sup></div>
                                    <img class ="card-image" src="${imgPath}" alt="Weather">
                                    </div>

                                    <div class="card-description">${condition}</div>
                                  </div>`;
    header.insertAdjacentHTML('afterend',html);

}
async function getWether(city){
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url)
    const data = await response.json();
    console.log(data);
    return data;
}

form.onsubmit = async (e) => {
    e.preventDefault();

    let city = input.value.trim();

    const data = await getWether(city);

    if (data.error) {
        removeCard();
        showError(data.error.message);

    }
    else {
        removeCard();

        const info = conditions.find((obj)=> obj.code === data.current.condition.code)


        const filePath = '/img/'
        const fileName = (data.current.is_day ? info.day : info.night) + '.png';
        const imgPath= filePath+fileName;

        const condition = data.current.is_day
            ?info.languages[32]['day_text']
            :info.languages[32]['night_text']

        const wetherData = {
            name:data.location.name,
            country:data.location.country,
            temp:data.current.temp_c,
            condition:condition,
            imgPath,
        };

        showCard(wetherData);
    }



};

