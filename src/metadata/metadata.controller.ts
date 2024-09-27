import { Body, Controller, Param, Post } from '@nestjs/common';
import { MetadataService } from './metadata.service';

@Controller('metadata')
export class MetadataController {
    constructor(private readonly metadataService: MetadataService) {}

    @Post('loginwithtoken')
    async loginwithtoken() {
        return this.metadataService.loginwithtoken();
    }

    @Post('getdata')
    async getmetadata() {
        return this.metadataService.getmetadata();
    }
}
