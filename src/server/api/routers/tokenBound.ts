/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {z} from 'zod';
import {Wallet} from 'ethers';
import {createTRPCRouter, publicProcedure} from '~/server/api/trpc';
import {SimpleAccountFactory__factory} from '@account-abstraction/contracts';
import {EntryPoint__factory} from '@account-abstraction/contracts';
import {getAddress} from 'ethers/lib/utils';
import {StaticJsonRpcProvider} from '@ethersproject/providers';
import {hexConcat} from 'ethers/lib/utils';

const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454';
const ENTRY_POINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
const lineaProvider = new StaticJsonRpcProvider('https://rpc.goerli.linea.build/');

const entryPoint = EntryPoint__factory.connect(ENTRY_POINT_ADDRESS, lineaProvider);

const simpleAccountFactory = SimpleAccountFactory__factory.connect(SIMPLE_ACCOUNT_FACTORY_ADDRESS, lineaProvider);

export const tokenBoundRouter = createTRPCRouter({
	createEphemeralEOA: publicProcedure.input(z.object({text: z.string()})).query(({input}) => {
		//input needs to be owner.address
		const owner = Wallet.createRandom();
		console.log('Generated wallet with private key:', owner.privateKey);
		return {
			greeting: `${owner.address} :: ${owner.privateKey}`,
		};
	}),
	createAAforEphemeralEOA: publicProcedure.input(z.object({text: z.string()})).query(async ({input}) => {
		const ownerAddres = input.text;
		const initCode = hexConcat([
			SIMPLE_ACCOUNT_FACTORY_ADDRESS,
			simpleAccountFactory.interface.encodeFunctionData('createAccount', [ownerAddres, 0]),
		]);
		const senderAddress = await entryPoint.callStatic
			.getSenderAddress(initCode)
			.then(() => {
				throw new Error('Expected getSenderAddress() to revert');
			})
			.catch((e) => {
				const data = e.message.match(/0x6ca7b806([a-fA-F\d]*)/)?.[1];
				if (!data) {
					return Promise.reject(new Error('Failed to parse revert data'));
				}
				const addr = getAddress(`0x${data.slice(24, 64)}`);
				return Promise.resolve(addr);
			});
		return {
			greeting: `${senderAddress}`,
		};
	}),
	getAll: publicProcedure.query(({ctx}) => {
		return ctx.prisma.example.findMany();
	}),
});
