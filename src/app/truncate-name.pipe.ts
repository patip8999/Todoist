import { Pipe, PipeTransform } from "@angular/core";

@Pipe ({
    name: 'truncateName',
    pure: true, 
    standalone: true
})

export class TruncateNamePipe implements PipeTransform {
    transform(value: string, maxLength: number = 60): string {
        if (!value) return '';
        return value.length > maxLength ? value.slice(0, maxLength) + '...' : value;
    }
    }
    
