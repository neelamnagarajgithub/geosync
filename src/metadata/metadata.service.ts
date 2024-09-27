import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import * as https from 'https';
import { InternalAxiosRequestConfig } from 'axios';
import { response } from 'express';

@Injectable()
export class MetadataService {
   apikey: string;
  constructor(private readonly httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      if (this.apikey) {
        config.headers['X-Auth-Token'] = this.apikey;
      }
      return config;
    });
  }


  async loginwithtoken(): Promise<any> {
    const loginurl = 'https://m2m.cr.usgs.gov/api/api/json/stable/login-token';
    
    // Create an HTTPS agent that ignores SSL certificate errors
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    const response = await  this.httpService.post(loginurl, {
      username: "neelamnagaraj99@gmail.com",
      token:"mTkwF56sLZAIC6mGQ4prlGiZmFzEJb5NL7uvH9JGfwO7z3HuP_ZfuYagARgxFU!f"
    }, {
      httpsAgent: httpsAgent,
    }
    )
    .pipe(
      map(response => response.data),
      catchError((error) => {
        // Log detailed error information
        console.error('Error occurred:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });
         throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An error occurred while logging in',
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      })
    ).toPromise();
    this.apikey=response.data;
    return response;
  }

  async getmetadata(): Promise<any> {
    const metadataurl = `https://m2m.cr.usgs.gov/api/api/json/stable/scene-metadata`;
    
    // Create an HTTPS agent that ignores SSL certificate errors
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    return this.httpService.get(metadataurl, {
      data:{
        datasetName: "landsat_ot_c2_l2",
        entityId: "LC08_L2SP_012025_20201231_20210308_02_T1",
        idType: "displayId",
        metadataType: "full",
        useCustomization: false
      },headers:{
        'X-Auth-Token':this.apikey
      },
      httpsAgent: httpsAgent, // Add the HTTPS agent to the request config
    })
    .pipe(
      map((response) => response.data),
      catchError((error) => {
        // Log detailed error information
        console.error('Error occurred:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        });
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'An error occurred while getting metadata',
        }, HttpStatus.INTERNAL_SERVER_ERROR
      );
      })
    )
  }
}