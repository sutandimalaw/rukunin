import { CreateUmkmProdukDto } from './create-umkm-produk.dto';
declare const UpdateUmkmProdukDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUmkmProdukDto>>;
export declare class UpdateUmkmProdukDto extends UpdateUmkmProdukDto_base {
    isAvailable?: boolean;
}
export {};
