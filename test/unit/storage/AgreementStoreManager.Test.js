/* eslint-env mocha */
/* eslint-disable no-console */
/* global artifacts, contract, describe, it, expect */

const chai = require('chai')
const { assert } = chai
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const Common = artifacts.require('Common')
const EpochLibrary = artifacts.require('EpochLibrary')
const AgreementStoreLibrary = artifacts.require('AgreementStoreLibrary')
const ConditionStoreManager = artifacts.require('ConditionStoreManager')
const TemplateStoreManager = artifacts.require('TemplateStoreManager')
const AgreementStoreManager = artifacts.require('AgreementStoreManager')

const constants = require('../../helpers/constants.js')
const testUtils = require('../../helpers/utils.js')

contract('AgreementStoreManager', (accounts) => {
    async function setupTest({
        agreementId = constants.bytes32.one,
        conditionIds = [constants.address.dummy],
        createRole = accounts[0],
        setupConditionStoreManager = true
    } = {}) {
        const common = await Common.new()
        const epochLibrary = await EpochLibrary.new()
        await ConditionStoreManager.link('EpochLibrary', epochLibrary.address)
        const conditionStoreManager = await ConditionStoreManager.new()
        const templateStoreManager = await TemplateStoreManager.new()
        const agreementStoreLibrary = await AgreementStoreLibrary.new()
        await AgreementStoreManager.link('AgreementStoreLibrary', agreementStoreLibrary.address)
        const agreementStoreManager = await AgreementStoreManager.new()

        await agreementStoreManager.initialize(
            conditionStoreManager.address,
            templateStoreManager.address,
            { from: createRole }
        )

        if (setupConditionStoreManager) {
            await conditionStoreManager.initialize(
                agreementStoreManager.address,
                { from: accounts[0] }
            )
        }

        return {
            agreementStoreManager,
            conditionStoreManager,
            templateStoreManager,
            agreementId,
            conditionIds,
            createRole,
            common
        }
    }

    describe('deploy and setup', () => {
        it('contract should deploy', async () => {
            // act-assert
            const epochLibrary = await EpochLibrary.new()
            await ConditionStoreManager.link('EpochLibrary', epochLibrary.address)

            const agreementStoreLibrary = await AgreementStoreLibrary.new()
            await AgreementStoreManager.link('AgreementStoreLibrary', agreementStoreLibrary.address)
            await AgreementStoreManager.new()
        })
    })

    describe('create agreement', () => {
        it('create agreement should have existing agreement and conditions created', async () => {
            const { agreementStoreManager, templateStoreManager, conditionStoreManager } = await setupTest()

            const templateId = constants.bytes32.one
            await templateStoreManager.createTemplate(
                templateId,
                [
                    constants.address.dummy,
                    accounts[0]
                ]
            )
            const storedTemplate = await templateStoreManager.getTemplate(templateId)

            const agreement = {
                did: constants.did[0],
                didOwner: constants.address.dummy,
                templateId: templateId,
                conditionIds: [constants.bytes32.zero, constants.bytes32.one],
                timeLocks: [0, 1],
                timeOuts: [2, 3]
            }
            const agreementId = constants.bytes32.one

            await agreementStoreManager.createAgreement(
                agreementId,
                ...Object.values(agreement)
            )

            let storedCondition
            agreement.conditionIds.forEach(async (conditionId, i) => {
                storedCondition = await conditionStoreManager.getCondition(conditionId)
                expect(storedCondition.typeRef).to.equal(storedTemplate.conditionTypes[i])
                expect(storedCondition.state.toNumber()).to.equal(constants.condition.state.unfulfilled)
                expect(storedCondition.timeLock.toNumber()).to.equal(agreement.timeLocks[i])
                expect(storedCondition.timeOut.toNumber()).to.equal(agreement.timeOuts[i])
            })

            expect((await agreementStoreManager.getAgreementListSize()).toNumber()).to.equal(1)
        })

        it('should not create agreement with existing conditions', async () => {
            const { agreementStoreManager, templateStoreManager } = await setupTest()

            const templateId = constants.bytes32.one
            await templateStoreManager.createTemplate(
                templateId,
                [constants.address.dummy]
            )

            const conditionIds = [constants.bytes32.zero]

            const agreement = {
                did: constants.did[0],
                didOwner: constants.address.dummy,
                templateId: templateId,
                conditionIds: conditionIds,
                timeLocks: [0],
                timeOuts: [2]
            }
            const agreementId = constants.bytes32.zero

            await agreementStoreManager.createAgreement(
                agreementId,
                ...Object.values(agreement)
            )

            const otherAgreement = {
                did: constants.did[1],
                didOwner: accounts[1],
                templateId: templateId,
                conditionIds: conditionIds,
                timeLocks: [3],
                timeOuts: [100]
            }
            const otherAgreementId = constants.bytes32.one

            await assert.isRejected(
                agreementStoreManager.createAgreement(
                    otherAgreementId,
                    ...Object.values(otherAgreement)
                ),
                constants.condition.id.error.idAlreadyExists
            )
        })

        it('should not create agreement with non existing template', async () => {
            const { agreementStoreManager } = await setupTest()

            const agreement = {
                did: constants.did[0],
                didOwner: constants.address.dummy,
                templateId: constants.bytes32.one,
                conditionIds: [constants.bytes32.zero],
                timeLocks: [0],
                timeOuts: [2]
            }
            const agreementId = constants.bytes32.zero

            await assert.isRejected(
                agreementStoreManager.createAgreement(
                    agreementId,
                    ...Object.values(agreement)
                ),
                constants.template.error.templateNotActive
            )
        })

        it('should not create agreement with existing ID', async () => {
            const { agreementStoreManager, templateStoreManager } = await setupTest()

            const templateId = constants.bytes32.one
            await templateStoreManager.createTemplate(
                templateId,
                [constants.address.dummy]
            )

            const agreement = {
                did: constants.did[0],
                didOwner: constants.address.dummy,
                templateId: templateId,
                conditionIds: [constants.bytes32.zero],
                timeLocks: [0],
                timeOuts: [2]
            }
            const agreementId = constants.bytes32.zero

            await agreementStoreManager.createAgreement(
                agreementId,
                ...Object.values(agreement)
            )
            const otherAgreement = {
                did: constants.did[1],
                didOwner: accounts[1],
                templateId: templateId,
                conditionIds: [constants.bytes32.one],
                timeLocks: [2],
                timeOuts: [3]
            }
            const otherAgreementId = constants.bytes32.zero

            await assert.isRejected(
                agreementStoreManager.createAgreement(
                    otherAgreementId,
                    ...Object.values(otherAgreement)
                ),
                constants.condition.id.error.idAlreadyExists
            )
        })

        it('create agreement should emit `AgreementCreated` event', async () => {
            const { agreementStoreManager, templateStoreManager } = await setupTest()

            const templateId = constants.bytes32.one
            await templateStoreManager.createTemplate(
                templateId,
                [
                    constants.address.dummy,
                    accounts[0]
                ]
            )

            const agreement = {
                did: constants.did[0],
                didOwner: constants.address.dummy,
                templateId: templateId,
                conditionIds: [constants.bytes32.zero, constants.bytes32.one],
                timeLocks: [0, 1],
                timeOuts: [2, 3]
            }
            const agreementId = testUtils.generateId()

            const result = await agreementStoreManager.createAgreement(
                agreementId,
                ...Object.values(agreement)
            )

            expect((await agreementStoreManager.getAgreementListSize()).toNumber()).to.equal(1)

            testUtils.assertEmitted(result, 1, 'AgreementCreated')

            const eventArgs = testUtils.getEventArgsFromTx(result, 'AgreementCreated')
            expect(eventArgs._agreementId).to.equal(agreementId)
            expect(eventArgs._did).to.equal(constants.did[0])
            expect(eventArgs._sender).to.equal(accounts[0])
            expect(eventArgs._didOwner).to.equal(constants.address.dummy)
            expect(eventArgs._templateId).to.equal(templateId)
        })
    })

    describe('get agreement', () => {
        it('successful create should get agreement', async () => {
            const { common, agreementStoreManager, templateStoreManager } = await setupTest()

            const templateId = constants.bytes32.one
            await templateStoreManager.createTemplate(
                templateId,
                [constants.address.dummy, accounts[0]]
            )

            const agreement = {
                did: constants.did[0],
                didOwner: constants.address.dummy,
                templateId: templateId,
                conditionIds: [constants.bytes32.one, constants.bytes32.zero],
                timeLocks: [0, 1],
                timeOuts: [2, 3]
            }
            const agreementId = constants.bytes32.one
            const blockNumber = await common.getCurrentBlockNumber()

            await agreementStoreManager.createAgreement(
                agreementId,
                ...Object.values(agreement)
            )

            // TODO - containSubset
            const storedAgreement = await agreementStoreManager.getAgreement(agreementId)
            expect(storedAgreement.did)
                .to.equal(agreement.did)
            expect(storedAgreement.didOwner)
                .to.equal(agreement.didOwner)
            expect(storedAgreement.templateId)
                .to.equal(agreement.templateId)
            expect(storedAgreement.conditionIds)
                .to.deep.equal(agreement.conditionIds)
            expect(storedAgreement.lastUpdatedBy)
                .to.equal(accounts[0])
            expect(storedAgreement.blockNumberUpdated.toNumber())
                .to.equal(blockNumber.toNumber())
        })
    })
})