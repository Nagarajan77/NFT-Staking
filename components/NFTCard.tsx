import type { FC } from 'react';
import { ThirdwebNftMedia, useContract, useNFT, Web3Button} from "@thirdweb-dev/react";
 
  interface NFTCardProps {
    tokenId: number; 
  }
  
  const NFTCard: FC<NFTCardProps> = ({ tokenId }) => {
    const kuramaAddress = "0x95ABAaa94690050e1AA68Ee44406275530B0d241";
    const stakingAddress = "0x26a0574E993bd10C51D1d4889d989F377e24A999";

    const {contract: kuramaContract } = useContract(kuramaAddress, "nft-drop");
    const {contract: stakingContract} = useContract(stakingAddress);
    const { data: nft } = useNFT(kuramaContract, tokenId);
    
    async function withdraw(nftId: string) {
        await stakingContract?.call("withdraw", [nftId]);
    }

    return (
      <>
        {nft && (
          <div>
            <h3>{nft.metadata.name}</h3>
            {nft.metadata && (
            <ThirdwebNftMedia
              metadata={nft.metadata}
              />
            )}
            <Web3Button
            contractAddress={stakingAddress}
            action={() => withdraw(nft.metadata.id)}
            >Withdraw</Web3Button>
          </div>
        )}
      </>
    )
  }
  export default NFTCard;