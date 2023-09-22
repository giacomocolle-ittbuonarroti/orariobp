import { Pipe, PipeTransform } from '@angular/core';
import { Docente } from './app.component';
import { Classe } from './app.component';
import { Aula } from './app.component';

@Pipe({
    name: 'coursefiltername',
    pure: false
})
export class CourseFilterNamePipe implements PipeTransform {

    transform(value: Docente[], filterBy: string): Docente[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((docente: Docente) =>
            (docente.DOC_COGN_NOME.toLocaleLowerCase().indexOf(filterBy) !== -1 )): value;
    }
}

@Pipe({
    name: 'coursefilterclasse',
    pure: false
})
export class CourseFilterClassePipe implements PipeTransform {

    transform(value: Classe[], filterBy: string): Classe[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((classe: Classe) =>
            (classe.CLASSE.toLocaleLowerCase().indexOf(filterBy) !== -1 )): value;
    }
}

@Pipe({
    name: 'coursefilteraula',
    pure: false
})
export class CourseFilterAulaPipe implements PipeTransform {

    transform(value: Aula[], filterBy: string): Aula[] {
        filterBy = filterBy ? filterBy.toLocaleLowerCase() : null;
        return filterBy ? value.filter((aula: Aula) =>
            (aula.AULA.toLocaleLowerCase().indexOf(filterBy) !== -1 )): value;
    }
}

@Pipe({
  name: "sort"
})
export class ArraySortPipe {
  transform(array: any[], field: string): any[] {
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}


// WEBPACK FOOTER //
// /Users/giacomo/Sites/orario_bp/orario-bp/src/app/coursefilters.pipe.ts