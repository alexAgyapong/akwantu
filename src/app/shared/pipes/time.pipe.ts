import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from 'ngx-bootstrap/chronos';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    const date = new Date(value);
    const res = `${date?.getHours()}:${date?.getMinutes()}`;
    return formatDate(date, 'HH:mm');
  }

}
