import {
	SimpleAccountFactory__factory,
	EntryPoint__factory,
	SimpleAccount__factory,
	EntryPoint,
	UserOperationStruct,
} from '@account-abstraction/contracts';
import {Provider, StaticJsonRpcProvider} from '@ethersproject/providers';
import {BigNumber, Wallet, constants} from 'ethers';
import {arrayify, hexlify, getAddress, hexConcat, formatEther, parseEther} from 'ethers/lib/utils';
import {ERC20, ERC20__factory} from '@pimlico/erc20-paymaster/contracts';
import {getERC20Paymaster} from '@pimlico/erc20-paymaster';
import {env} from '~/env.mjs';

const privateKey = 'GENERATED_PRIVATE_KEY'; // replace this with a private key you generate!
const apiKey = env.PIMLICO_API_KEY;
const chain = 'mumbai'; // find the list of supported chain names on the Pimlico docs page

const ENTRY_POINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454';

const pimlicoEndpoint = `https://api.pimlico.io/v1/${chain}/rpc?apikey=${apiKey}`;

const pimlicoProvider = apiKey.match(apiKey) ? undefined : new StaticJsonRpcProvider(pimlicoEndpoint);
if (pimlicoProvider === undefined) {
	console.log('Warning: no Pimlico API key provided, will attempt to bundle using `owner` wallet');
}

if (privateKey.match(privateKey)) {
	throw new Error(
		'Please replace the `privateKey` variable with a newly generated private key. You can use `Wallet.createRandom().privateKey` for this'
	);
}

const rpcUrl = `https://${chain}.rpc.thirdweb.com`;
const rpcProvider = new StaticJsonRpcProvider(rpcUrl);
