

deploy:
	forge script ./script/MerkleDistributor.s.sol:MerkleDistributorScript \
	--chain-id 80001 \
	--rpc-url $(ETH_RPC_URL) \
    --private-key $(PRIVATE_KEY) \
    --etherscan-api-key $(ETHERSCAN_API_KEY) \
	--broadcast \
    --verify \
	-vvvv

verify:
	forge verify-contract $(ADDRESS) ./src/MerkleDistributor.sol:MerkleDistributor $(ETHERSCAN_API_KEY) \
	--chain 80001

# make deploy ETH_RPC_URL= PRIVATE_KEY=XXXXX ETHERSCAN_API_KEY=XXXXXXXXXXXX
# make verify ADDRESS=0x00000000 ETHERSCAN_API_KEY=XXXXXXXXXXXX
