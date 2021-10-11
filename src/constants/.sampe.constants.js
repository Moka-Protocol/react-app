import { ChainId } from '@usedapp/core'

export const KEYS = {
	ROPSTEN: {
		CHAINID: ChainId.Ropsten,
		CHAINRPC: '',
		SUBGRAPH_URI: ''
	},
	MUMBAI: {
		CHAINID: ChainId.Mumbai,
		CHAINRPC: '',
		SUBGRAPH_URI: ''
	},
	MATIC: {
		CHAINID: ChainId.Polygon,
		CHAINRPC: '',
		SUBGRAPH_URI: ''
	}
}

export const CONTRACTS = {
	ROPSTEN: {
		MOKATOKEN: '',
		FORUMFACTORY: '',
		MOKATOKENSALE: ''
	},
	MUMBAI: {
		MOKATOKEN: '',
		FORUMFACTORY: '',
		MOKATOKENSALE: ''
	},
	MATIC: {
		MOKATOKEN: '',
		FORUMFACTORY: '',
		MOKATOKENSALE: ''
	}
}

export const BLOCKEXPLORERS = {
	ROPSTEN: 'https://ropsten.etherscan.io/',
	MUMBAI: 'https://mumbai.polygonscan.com/',
	MATIC: 'https://polygonscan.com/'
}