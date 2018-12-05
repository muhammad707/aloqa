import React, { Component } from 'react';
import axios from 'axios';
// import { InfoToPrint } from './SendPayment';

class Print extends Component {
    constructor(props) {
        super(props);
        console.log(props.location.state);
    }
componentDidMount() {
    // console.log(this.state.info);
}
    

    render() {
        return (
            <div>
                <div style={{ color: "black", fontSize: "16px", width: '50%', float: "right", padding:"20px", clear: "both"}}>
		            АТ "Алокабанк" Амалиёт бошқармаси <br />
		            жўнатувчи мижоз Ф.И.Ш._____ дан <br />
		            Паспорт маьлумотлари: <br />
		            Серия/Номер  __________________________ <br />
		            Қачон берилган  ________________________ <br />
		                Амал қилиш муддати  ____________________ <br />
	            </div>
                <h3 style={{textAlign: "center", clear: "both", paddingTop: "30px"}}>А Р И З А</h3>
                <div style={{ color: "black", fontSize: "16px", width: "90%", margin: "auto" }}>
                    Менга сўм / АҚШ долларида талаб қилиб олингунча ҳисобварақ очишингизни сўрайман. <br/>
		            ____________________________________________________ - рақамли ҳисобварағим <br/>
                    бўйича операцияларни амалга оширишда шарт бўлиши ҳисобланадиган имзоларим <br/>
                    (Мен томондан ваколат берилган шахсларнинг имзолари) намуналарини маълум қиламан. <br/>

                    Менга тегишли 2020600.....  ҳисоб рақамимдаги пул маблағларимни "Aloqa Ekspress" <br/> пул ўтказмаси тизими орқали олувчи мижоз Ф.И.Ш. га ўтказиб беришингизни сўрайман.<br/>
                    1)  Пул ўтказмаси суммаси <br/>  
                    2)  Олувчи мижоз Ф.И.Ш. <br/>
                    “Aloqa Ekspress” пул ўтказмаси шартлари билан танишдим, пул ўтказмасини амалга <br/>ошириш учун банк хизмат ҳақини менинг 20206000.....  ҳисобрақамимдан ечиб <br/>олишингизни сўрайман. <br/>
	            </div>
                <div>
                    <div style={{ color: "black", fontSize: "16px", width: "40%", paddingTop: "15px", marginLeft: "30px", float: "left"}}>
                        Сана: 20___й. «____» <br/><br/> 
                        Оператор:_________________<br/>

                    </div> 
                    <div style={{ color: "black", fontSize: "12px", width: "50%", paddingTop: "15px", marginLeft: "30px", float: "right"}}>
                    _____________________________________ <br/>
                        <span style={{ marginLeft: "40px", fontStyle: "italic", paddingBottom: "30px"}}>(мижознинг имзоси)</span> <br/> <br />
                    ____________________________________ <br/>
                            <span style={{ marginLeft: "40px", fontStyle: "italic", paddingBottom: "30px"}}>(оператор имзоси)</span> <br/>

		            </div>
	            </div>
                <div style={{ borderBottom: "3px solid black", clear: "both", padding: "20px"}}></div>
                <div style={{ marginTop: "30px", fontSize: "16px", color: "black", padding: "30px"}}>
                    Ҳисобварақ очиш бўйича ҳужжатларни текширдим: бош бухгалтер _________________ <br/>
                    сўм / АҚШ долларида талаб қилиб олингунча ҳисобварақ очишга рухсат бераман.<br/>
                    Бошқарувчи _______________	<br/>
                    (имзо)	<br/>
                    Ҳисобварақ 20__йил «___» _______________да очилди. <br/>
                    Ҳисобварақ рақами _________________________________________________<br/>
                </div>
            </div>
        );
    }
}

export default Print;