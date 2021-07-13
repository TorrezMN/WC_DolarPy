const template = document.createElement('template');
template.innerHTML = `
        <style>
            h3{
            color:coral;
            }
            .boxLoading{
                background: #FFB74D;
                border-radious: 5px;
                width:100%;
            }
            .cot_item{
                display: flex;
                flex-direction: row;     
                justify-content: center; 
                align-items: center;    
                margin-right: .08vw;
                padding:4px;
            }
            .cot_item>p{
                text-align:center;
            }
            .cot_data_container_simple_marquee{
                display: flex;           
                flex-direction: row;  
                justify-content: center; 
                align-items: center;  
                
            }
            .cot_values{
                display: flex;           
                flex-direction: column;  
                justify-content: center; 
                align-items: center;  
                margin-left: 2vw;
                
            }
            .cot_values>p{
                padding:0;
                margin:0;
            }
            .cot_item:nth-child(even){
                border: 1px solid #E0E0E0;
            }
            .cot_item:nth-child(odd){
                border: 1px solid #FFB74D;
            }
            // STACKED TABLE
            .stacked_table_data{
                display: flex;           
                flex-direction: column;  
                justify-content: center; 
                align-items: center;  
            }
            .cot_data_container_simple_table_stacked{
                display: flex;           
                flex-direction: column;  
                justify-content: center; 
                align-items: center;  
                
            }
            .cot_data_container_simple_table_stacked>.cot_item{
                background:#4FC3F7;
                min-width:30vw;
            }
            
        </style>
        <div class='dolar-py'>
        
        </div>
`
class Dolar_Py extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.uc_container = this.shadowRoot.querySelector(".dolar-py");
        this.base_url = 'https://dolar.melizeche.com/api/1.0/';
        this.cotization = null;
        this.get_cotization();


        this.logos = {
            'bbva': 'https://www.activede.com/wp-content/uploads/2018/11/bbva-min.jpg',
            'bcp': 'https://pbs.twimg.com/profile_images/1399698369392558080/JF0WMK6X_400x400.jpg',
            'bonanza': 'https://www.bonanzacambios.com.py/styles/images/logo_bonanza.png',
            'cambiosalberdi': 'http://www.cambiosalberdi.com/assets/images/logo/logo_menu.png',
            'cambioschaco': 'http://www.cambioschaco.com.py/wp-content/themes/cambioschaco/images/logo-facebook.png',
            'eurocambios': 'https://eurocambios.com.py/v2/wp-content/uploads/2018/10/logo_eurocambios_2018_ok-02.png',
            'interfisa': 'https://www.interfisa.com.py/images/logo-interfisa.png',
            'interfisa': 'https://www.interfisa.com.py/images/logo-interfisa.png',
            'lamoneda': 'https://wwwipparaguaycompyc1e3d.zapwp.com/q:intelligent/exif:true/retina:false/webp:true/w:1/url:https://www.ipparaguay.com.py/wp-content/uploads/2020/10/Cambios-La-Moneda.jpeg',
            'maxicambios': 'https://www.maxicambios.com.py/themes/maxicambios_2/assets/images/logo-2.svg',
            'mundialcambios': 'https://mundialcambios.com.py/images/logo-home-4.png',
            'mydcambios': 'https://www.mydcambios.com.py/cambios/images/logo.png',
            'set': 'https://i1.wp.com/logoroga.com/wp-content/uploads/2016/11/set.png?fit=900%2C900&ssl=1',
            'vision': 'https://www.visionbanco.com/assets/img/core/vision-logo.png?v=1.0',

        }
    }

    static get observedAttributes() {
        return ['exchangekeeper'];
      }
    
    get_cotization() {

        let loader = `<div class="boxLoading">loading...</div>`;
        this.shadowRoot.querySelector(".dolar-py").innerHTML = loader

        fetch(this.base_url)
            .then(response => response.json())
            .then((data) => {
                this.cotization = data.dolarpy;
            }).then(() => {

                this.build_data();

            });
    }
    build_data() {
        let cot = ``;
        
        for (let i of Object.keys(this.cotization)) {
            
            cot += `
                <div class='cot_item'>
                    <b>${i.toUpperCase()}</b>  
                    <div class='cot_values'>
                    <p>compra: ${this.cotization[i]['compra']}</p>
                    <p> venta:${this.cotization[i]['venta']}</p>
                    </div>
                </div>
                `

        };
        switch (this.getAttribute('kind')) {
            case 'simple-marquee':
                this.draw_simple_marquee(cot);
                break;
            case 'table-stacked':
                this.draw_simple_table_stacked(cot);
                break;
            case 'simple':
                this.draw_simple(cot);
                break;
            case 'custom-table-stacked':
                this.draw_custom_table_stacked(cot);
                break;

            default:
                break;
        }
    }
    draw_custom_table_stacked(data){
        let expected_excahnge = this.getAttribute('exchangekeeper').split(',');
        let cot = ``;
        for (let i of expected_excahnge) {
                
                
            cot += `
            <div class='cot_item'>
                <b>${i.toUpperCase()}</b>  
                <div class='cot_values'>
                <p>compra: ${this.cotization[i.replace(/\s/g, '')]['compra']}</p>
                <p> venta:${this.cotization[i.replace(/\s/g, '')]['venta']}</p>
                </div>
            </div>
            `

        };
        this.shadowRoot.querySelector(".dolar-py").innerHTML = `
                <div class = 'stacked_table_data'>
                        <div class='cot_data_container_simple_table_stacked'>${cot}</div>
                </div>`;

    }
    draw_simple(data) {
        let cot = ``;
        for (let i of Object.keys(this.cotization)) {
            cot += `|${i.toUpperCase()} -> compra: ${this.cotization[i]['compra']}, venta:${this.cotization[i]['venta']}|<br>`
        };
        this.shadowRoot.querySelector(".dolar-py").innerHTML = `
                <span class = 'simple_cotization'>
                        ${cot}
                </span>`;

    }
    draw_simple_table_stacked(table_data) {
        this.shadowRoot.querySelector(".dolar-py").innerHTML = `
                <div class = 'stacked_table_data'>
                        <div class='cot_data_container_simple_table_stacked'>${table_data}</div>
                </div>`;

    }
    draw_simple_marquee(marquee_data) {
        this.shadowRoot.querySelector(".dolar-py").innerHTML = `
                <marquee behavior=scroll direction="left" scrollamount="5">
                        <div class='cot_data_container_simple_marquee'>${marquee_data}</div>
                </marquee>`;
    }



    attributeChangedCallback(name, oldValue, newValue) {
        console.log('attribute changed callback being executed now');
        
        switch (name) {
            case 'exchangekeeper':
        this.draw_custom_table_stacked(newValue);
        console.log(this.cotization);
                
                break;
        
            default:
                break;
        }
     
    }


}




window.customElements.define('dolar-py', Dolar_Py);


