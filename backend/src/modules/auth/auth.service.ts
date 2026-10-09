import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// ─── Hardcoded fallback accounts ─────────────────────────────────────────────
// These bypass the database and work immediately for development / demo.
// In production, remove or gate behind an ENV flag.

interface FallbackUser {
  id: string;
  name: string;
  email: string;
  role: string;
  password: string; // plain-text matched directly
}

const FALLBACK_ACCOUNTS: FallbackUser[] = [
  {
    id: 'EMP-001',
    name: 'Plant Owner / MD',
    email: 'owner@apexmobile.com',
    role: 'TOP_MANAGEMENT',
    password: 'owner123',
  },
  {
    id: 'EMP-002',
    name: 'Production Manager',
    email: 'prod@apexmobile.com',
    role: 'PRODUCTION_MANAGER',
    password: '123',
  },
  {
    id: 'EMP-003',
    name: 'Warehouse Manager',
    email: 'stores@apexmobile.com',
    role: 'WAREHOUSE_MANAGER',
    password: '123',
  },
  {
    id: 'EMP-004',
    name: 'Finance & Accounts',
    email: 'finance@apexmobile.com',
    role: 'FINANCE_ACCOUNTS',
    password: '123',
  },
];

// ─── Auth Service ─────────────────────────────────────────────────────────────

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    // 1. Try hardcoded fallback first (instant, no DB required)
    const fallback = FALLBACK_ACCOUNTS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (fallback && password === fallback.password) {
      return this.buildResponse(fallback);
    }

    // 2. Try database lookup
    try {
      const dbUser = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (dbUser) {
        const passwordValid = await bcrypt.compare(password, dbUser.password);
        if (passwordValid) {
          return this.buildResponse({
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role as string,
            password: '',
          });
        }
      }
    } catch {
      // DB unavailable — silently fall through; hardcoded accounts already checked above.
    }

    throw new UnauthorizedException('Invalid email or password.');
  }

  private buildResponse(user: Omit<FallbackUser, 'password'> & { id: string | number }) {
    const payload = {
      sub:   user.id,
      email: user.email,
      role:  user.role,
      name:  user.name,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    };
  }
}
