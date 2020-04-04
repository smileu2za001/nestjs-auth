import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from '../task-status.enum'

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGESS,
        TaskStatus.DONE,
    ];

    private isStatusValid(status: any) {
        const idx = this.allowedStatuses.indexOf(status);
        console.log("Index = "+ idx);
        return (idx !== -1);
    }
    
    transform(value: any, metadata: ArgumentMetadata) {
        value = value.toUpperCase();
        if(!this.isStatusValid(value)){
            throw new BadRequestException(value + " is an invalid status");
        }
        return value;
    }


}