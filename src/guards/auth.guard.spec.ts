import { JwtAuthGuard } from "./auth.guard.js";


describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new JwtAuthGuard()).toBeDefined();
  });
});
