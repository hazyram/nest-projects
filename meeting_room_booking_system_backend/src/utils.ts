import * as crypto from 'crypto'
import { ParseIntPipe, BadRequestException } from '@nestjs/common'

export function md5(str: string) {
  const hash = crypto.createHash('md5')
  hash.update(str)
  return hash.digest('hex')
}

export function generateParseIntPipe(name: string) {
    return new ParseIntPipe({
      exceptionFactory() {
        throw new BadRequestException(name + ' 应该传数字');
      } 
    })
}