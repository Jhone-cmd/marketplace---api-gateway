import { Module } from "@nestjs/common";
import { CacheFallbackService } from "./cache-fallback.service.js";
import { DefaultFallbackService } from "./default-fallback.service.js";

@Module({
    providers: [CacheFallbackService, DefaultFallbackService],
    exports: [CacheFallbackService, DefaultFallbackService],
})
export class FallbackModule { }