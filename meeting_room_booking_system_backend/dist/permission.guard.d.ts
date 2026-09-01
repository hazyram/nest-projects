import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class PermissionGuard implements CanActivate {
    private reflector;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
