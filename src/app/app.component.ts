import {Component,OnInit} from '@angular/core';
import {Observable} from "rxjs";

import {HttpClient} from "@angular/common/http";

import * as $ from 'jquery';

import * as _ from 'lodash';

export interface Course {
    Numero: string;
    DURATA: string;
    FREQUENZA: string;
    MAT_COD: string;
    MAT_NOME: string;
    DOC_COGN: string;
    DOC_NOME: string;
    CLASSE: string;
    AULA: string;
    PERIODICITA: string;
    SPECIFICA: string;
    CO_DOC: string;
    COEFF: string;
    GIORNO: string;
    O_INIZIO: string;
    ALUNNI: string;
}

export interface Lezione {
    Numero: string;
    DURATA: string;
    MAT_COD: string;
    DOC_COGN_NOME1: string;
    DOC_COGN_NOME2: string;
    DOC_COGN1: string;
    DOC_COGN2: string;
    CLASSE1: string;
    CLASSE2: string;
    AULA1: string;
    AULA2: string;
    AULA3: string;
    GIORNO: string;
    O_INIZIO: string;

}

export interface Docente {
    DOC_COGN_NOME: string;
}

export interface Classe {
    CLASSE: string;
}

export interface Aula {
    AULA: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    objectKeys = Object.keys;
    courses$: Observable<any>;
    docentes$: Array<Docente>;
    classes$: Array<Classe>;
    aulas$: Array<Aula>;
    leziones$: Array<Lezione>;
    
    orariotable$: any;

    selitem: string;

    term:any;

    days = ['lunedì','martedì','mercoledì','giovedì','venerdì'];
    hours = ['07h50','08h40','09h30','10h30','11h20','12h10','13h00','13h50','14h40','15h30'];

    constructor(private http:HttpClient) {
      this.courses$ = new Observable();
      var tdocentes = new Array<Docente>();
      this.classes$ = new Array<Classe>();
      this.aulas$ = new Array<Aula>();
      this.leziones$ = new Array<Lezione>();
      this.selitem = "";

    }

    ngOnInit() {
        this.courses$ = this.http.request(
            "GET",
            "assets/EXP_COURS.json", 
            {
                responseType:"json"
            }
        );
        this.courses$.subscribe(data => {

              //split double values and create lezione array
              var tdocentes = new Array<Docente>();
              var tclasses = new Array<Classe>();
              var taulas = new Array<Aula>();
              var tleziones = new Array<Lezione>();
              data.forEach(element => {
                var lezione = {
                    Numero: element.Numero,
                    DURATA: element.DURATA,
                    MAT_COD: element.MAT_COD,
                    DOC_COGN_NOME1: "",
                    DOC_COGN_NOME2: "",
                    DOC_COGN1: "",
                    DOC_COGN2: "",
                    CLASSE1: "",
                    CLASSE2: "",
                    AULA1: "",
                    AULA2: "",
                    AULA3: "",
                    GIORNO: element.GIORNO,
                    O_INIZIO: element["O.INIZIO"],

                }
                // docentes
                var nome = new String(element.DOC_NOME);
                var cogn = new String(element.DOC_COGN);
                if (cogn.includes(",")){
                  lezione.DOC_COGN_NOME1 = cogn.substring(0,cogn.indexOf(","))+" "+nome.substring(0,nome.indexOf(","));
                  lezione.DOC_COGN1 = cogn.substring(0,cogn.indexOf(","));
                  tdocentes.push({
                    DOC_COGN_NOME: lezione.DOC_COGN_NOME1
                  });
                  lezione.DOC_COGN_NOME2 = cogn.substring(cogn.indexOf(",")+2)+" "+nome.substring(nome.indexOf(",")+2);
                  lezione.DOC_COGN2 = cogn.substring(cogn.indexOf(",")+2);
                  tdocentes.push({
                    DOC_COGN_NOME: lezione.DOC_COGN_NOME2
                  });
                }else{
                  lezione.DOC_COGN_NOME1 =cogn+" "+nome;
                  lezione.DOC_COGN1 =cogn.toString();
                  tdocentes.push({DOC_COGN_NOME: lezione.DOC_COGN_NOME1 });
                }
                // classes
                var classe = new String(element.CLASSE);
                if (classe.includes(",")){
                  lezione.CLASSE1 = classe.substring(0,classe.indexOf(","))
                  tclasses.push({
                    CLASSE: lezione.CLASSE1
                  });
                  lezione.CLASSE2 = classe.substring(classe.indexOf(",")+2); 
                  tclasses.push({
                    CLASSE: lezione.CLASSE2
                  });
                }else{
                  lezione.CLASSE1 = classe.toString();
                  tclasses.push({CLASSE:lezione.CLASSE1});
                }
                // aulas
                var aula = new String(element.AULA);
                if (aula.includes(",")){
                  lezione.AULA1 = aula.substring(0,aula.indexOf(","));
                  taulas.push({
                    AULA:lezione.AULA1
                  });
                  var other_aula = aula.substring(aula.indexOf(",")+2)
                  if (other_aula.includes(",")){
                    lezione.AULA2 = other_aula.substring(0,other_aula.indexOf(","));
                    taulas.push({
                      AULA: lezione.AULA2
                    }); 
                    lezione.AULA3 = other_aula.substring(other_aula.indexOf(",")+2);
                    taulas.push({
                      AULA: lezione.AULA3
                    });
                  }else{
                    lezione.AULA2 = other_aula.toString()
                    taulas.push({AULA: lezione.AULA2});
                  }
                }else{
                  lezione.AULA1 = aula.toString()
                  taulas.push({AULA:lezione.AULA1});
                }
                // add lezione to leziones$
                tleziones.push(lezione);
              });

              //assign lezione array
              this.leziones$ = tleziones;

              //
              // create unique arrays

              // unique docentes
              var unique = {};
              var distinctDocentes = new Array<Docente>();
              for( var i in tdocentes ){
                if( typeof(unique[tdocentes[i].DOC_COGN_NOME]) == "undefined"){
                  distinctDocentes.push({DOC_COGN_NOME:tdocentes[i].DOC_COGN_NOME});
                }
                unique[tdocentes[i].DOC_COGN_NOME] = 0;
              }
              this.docentes$ = distinctDocentes;
              
              // unique classes
              var unique = {};
              var distinctClasses = new Array<Classe>();
              for( var i in tclasses ){
                if( typeof(unique[tclasses[i].CLASSE]) == "undefined"){
                  distinctClasses.push({CLASSE:tclasses[i].CLASSE});
                }
                unique[tclasses[i].CLASSE] = 0;
              }
              this.classes$ = distinctClasses;

              // unique aulas
              var unique = {};
              var distinctAulas = new Array<Aula>();
              for( var i in taulas ){
                if( typeof(unique[taulas[i].AULA]) == "undefined"){
                  distinctAulas.push({AULA:taulas[i].AULA});
                }
                unique[taulas[i].AULA] = 0;
              }
              this.aulas$ = distinctAulas;

              
              
              var orariotable = new Array();

              this.hours.forEach(hour => {
                var orariorow = new Array();
                this.days.forEach(day => {
                  orariorow[day] = ""
                });
                orariotable[hour] = orariorow;
              });

              this.orariotable$ = orariotable;

              console.log(" data loaded");
        });

    }

    buttonDocenteClick(cogn_nome: string){
        console.log(cogn_nome);
        this.selitem = cogn_nome;

        var fleziones = this.leziones$.filter((element)=>{return element.DOC_COGN_NOME1 === cogn_nome || element.DOC_COGN_NOME2 ===  cogn_nome});

        var orariotable = new Array();

        this.hours.forEach(hour => {
          var orariorow = new Array();
          this.days.forEach(day => {
            orariorow[day] = {DURATA:"1"};
          });
          orariotable[hour] = orariorow;
        });

        fleziones.forEach(element => {
          try{
            orariotable[element.O_INIZIO][element.GIORNO]=element;
            orariotable[element.O_INIZIO][element.GIORNO]["DURATA"]= element.DURATA.charAt(0);
            switch (element.DURATA.charAt(0)){
                  case "2":
                    delete orariotable[this.hours[this.hours.indexOf(element.O_INIZIO)+1]][element.GIORNO];
                    break;
                  case "3":
                    delete orariotable[this.hours[this.hours.indexOf(element.O_INIZIO)+1]][element.GIORNO];
                    delete orariotable[this.hours[this.hours.indexOf(element.O_INIZIO)+2]][element.GIORNO];
                    break;
            }
          }catch(e){
            var i=0;
        }
        });
        this.orariotable$ = orariotable;

    }

    buttonClasseClick(classe: string){
        console.log(classe);
        this.selitem =classe;

        var fleziones = this.leziones$.filter((element)=>{return element.CLASSE1 === classe || element.CLASSE2 ===  classe});

        var orariotable = new Array();

        this.hours.forEach(hour => {
          var orariorow = new Array();
          this.days.forEach(day => {
            orariorow[day] = {DURATA:"1"};
          });
          orariotable[hour] = orariorow;
        });

        fleziones.forEach(element => {
          orariotable[element.O_INIZIO][element.GIORNO]= element;
          orariotable[element.O_INIZIO][element.GIORNO]["DURATA"]= element.DURATA.charAt(0);
          switch (element.DURATA.charAt(0)){
                case "2":
                  delete orariotable[this.hours[this.hours.indexOf(element.O_INIZIO)+1]][element.GIORNO];
                  break;
                case "3":
                  delete orariotable[this.hours[this.hours.indexOf(element.O_INIZIO)+1]][element.GIORNO];
                  delete orariotable[this.hours[this.hours.indexOf(element.O_INIZIO)+2]][element.GIORNO];
                  break;
          }
        });

        this.orariotable$ = orariotable;

    }

    buttonAulaClick(aula: string){
        console.log(aula);
        this.selitem = aula;

        var fleziones = this.leziones$.filter((element)=>{return element.AULA1 === aula || element.AULA2 ===  aula || element.AULA3 ===  aula });
      
        var orariotable = new Array();

        this.hours.forEach(hour => {
          var orariorow = new Array();
          this.days.forEach(day => {
            orariorow[day] = {DURATA:"1"};
          });
          orariotable[hour] = orariorow;
        });

        fleziones.forEach(element => {
          orariotable[element.O_INIZIO][element.GIORNO]=element;
          orariotable[element.O_INIZIO][element.GIORNO]["DURATA"]= element.DURATA.charAt(0);
          switch (element.DURATA.charAt(0)){
                case "2":
                  delete orariotable[this.hours[this.hours.indexOf(element.O_INIZIO)+1]][element.GIORNO];
                  break;
                case "3":
                  delete orariotable[this.hours[this.hours.indexOf(element.O_INIZIO)+1]][element.GIORNO];
                  delete orariotable[this.hours[this.hours.indexOf(element.O_INIZIO)+2]][element.GIORNO];
                  break;
          }
        });

        this.orariotable$ = orariotable;

    }
}






// WEBPACK FOOTER //
// /Users/giacomo/Sites/orario_bp/orario-bp/src/app/app.component.ts