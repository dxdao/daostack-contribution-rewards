import { LedgerSigner } from '@anders-t/ethers-ledger'
import { JsonRpcSigner } from '@ethersproject/providers'
import { task } from 'hardhat/config'
import { mkdir, writeFile } from 'fs/promises'
import { types } from 'hardhat/config'

task('deploy', 'Deploys contract')
  .addOptionalParam(
    'ledger',
    'To use a Ledger wallet to deploy contracts',
    false,
    types.boolean,
  )
  .setAction(async function deployTask(taskArgs, hre) {
    const { ethers } = hre

    let signer: JsonRpcSigner | LedgerSigner = ethers.provider.getSigner()

    console.log(await ethers.provider.getBlockNumber())

    // Check for legder wallet
    if (taskArgs.ledger) {
      console.log('Using Ledger wallet')
      signer = new LedgerSigner(ethers.provider)
    }

    console.log('Deploying contracts from ', await signer.getAddress())

    const ContributionReward = await ethers
      .getContractFactory('ContributionReward')
      .then((factory) => factory.connect(signer))

    const contributionReward = await ContributionReward.deploy()

    await contributionReward.deployed()

    console.log('ContributionReward deployed to:', contributionReward.address)

    // set params for ContributionReward
    await contributionReward
      .setParameters(
        '0x399141801e9e265d79f1f1759dd67932980664ea28c2ba7e0e4dba8719e47118',
        '0x332B8C9734b4097dE50f302F7D9F273FFdB45B84',
      )
      .then((tx) => tx.wait())

    console.log('Parameters has been set on ContributionReward')

    const contractAddresses = {
      contributionReward: {
        address: contributionReward.address,
        deployment: contributionReward.deployTransaction,
      },
    }

    const contractAddressesJson = JSON.stringify(contractAddresses, null, 2)

    await mkdir('deployments', { recursive: true })

    const deploymentISODate = new Date().toISOString().replace(/:/g, '-')

    await writeFile(
      `./deployments/deployment-${ethers.provider.network.chainId}-${deploymentISODate}.json`,
      contractAddressesJson,
    )
  })
