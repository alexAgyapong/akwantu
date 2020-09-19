import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { formatDate } from 'ngx-bootstrap/chronos';
@Pipe({
  name: 'formatDuration'
})
export class FormatDurationPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    const duration = moment.duration(value);
    const date = new Date(duration.asMilliseconds());
    const minutes = date.getMinutes();
    const minuteString = minutes < 10 ? minutes === 0 ? '' : `0${minutes}` : minutes;
    const result = `${date.getHours()}h${minuteString}`;

    return result;
  }

}
