/* eslint-disable react/jsx-key */
import { ConnectWallet, useAddress, Web3Button, useContract, useOwnedNFTs, ThirdwebNftMedia, useContractRead } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { BREAK } from "graphql";
import { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";
import { BigNumber, ethers } from "ethers";


const Home: NextPage = () => {
  const address = useAddress();
  
const kuramaAddress = "0x95ABAaa94690050e1AA68Ee44406275530B0d241";
const stakingAddress = "0x26a0574E993bd10C51D1d4889d989F377e24A999";

const {contract: kuramaContract } = useContract(kuramaAddress, "nft-drop");
const {contract: stakingContract} = useContract(stakingAddress);

const {data: myKuramaNFTs} = useOwnedNFTs(kuramaContract, address);

//staked line code

const {data:stakedKuramaNFTs} = useContractRead(stakingContract, "getStakeInfo", [address]);

// create a staking function

async function stakeNFT(nftId: string) {
  if (!address) return;

  const isApproved = await kuramaContract?.isApproved( address, stakingAddress);
  
  if (!isApproved) {
    await kuramaContract?.setApprovalForAll(stakingAddress, true);
  }
  await stakingContract?.call("stake", [nftId])
}

// Claimable Rewards Code

const [claimableRewards, setClaimableRewards] = useState<BigNumber>();

  useEffect(() => {
  if (!stakingContract || !address) return;

  async function loadClaimableRewards() {
    const stakeInfo = await stakingContract?.call("getStakeInfo", [address]);
    setClaimableRewards(stakeInfo[1]);
  }

  loadClaimableRewards();
}, [address, stakingContract]);


  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>KURAMA NFT </h1>
        <Web3Button
        contractAddress={kuramaAddress}
        action={(kuramaContract) => kuramaContract.erc721.claim(1)}
        >Claim KURAMA</Web3Button>
        <br />
        <h1>MY KURAMA </h1>
        <div>
        {myKuramaNFTs?.map((nft) => (
            <div>
             <h3>{nft.metadata.name}</h3>
            <ThirdwebNftMedia
             metadata={nft.metadata}
             height="100px"
             width="100px"
         />
          <Web3Button
          contractAddress={stakingAddress}
         action={() => stakeNFT(nft.metadata.id)}
         > SEAL YOUR KURAMA </Web3Button>
          </div>
        ))}
        </div>
        <h1>KURAMA SEALED</h1>
        <div>
  {stakedKuramaNFTs && stakedKuramaNFTs[0].map((stakedNFT: BigNumber) => (
      <div key={stakedNFT.toString()}>
      <NFTCard tokenId={stakedNFT.toNumber()}  />
      </div>
    ))}
    </div> 
    <br/>
    <h1> CLAIMABLE CHAKRA </h1>

    <p>
    {!claimableRewards
    ? "Loading..."
    : ethers.utils.formatUnits(claimableRewards, 18)}
    </p>


    <Web3Button
  action={(stakingContract) => stakingContract.call("claimRewards")}
  contractAddress={stakingAddress}
>CLAIM CHAKRA</Web3Button> 


      </main>
    </div>
  );
};

export default Home;
