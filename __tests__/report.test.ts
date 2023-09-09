/**
 * Unit tests for src/report.ts
 */

import { expect } from '@jest/globals'
import { readFile } from '../src/fs'
import { isValidReport, parseReport, renderReportSummary } from '../src/report'

async function getReport(file = 'report-valid.json') {
	return await readFile(`__tests__/__fixtures__/${file}`)
}

async function getShardedReport() {
	return await getReport('report-sharded.json')
}

async function getInvalidReport() {
	return await getReport('report-invalid.json')
}

describe('isValidReport', () => {
	it('detects valid reports', async () => {
		const report = await getReport()
		expect(isValidReport(JSON.parse(report))).toBe(true)
	})
	it('detects invalid reports', async () => {
		const report = await getInvalidReport()
		expect(isValidReport([])).toBe(false)
		expect(isValidReport('')).toBe(false)
		expect(isValidReport(JSON.parse(report))).toBe(false)
	})
})

describe('parseReport', () => {
	const getParsedReport = async () => parseReport(await getReport())
	const getParsedShardedReport = async () =>
		parseReport(await getShardedReport())
	it('returns an object', async () => {
		const parsed = await getParsedReport()
		expect(typeof parsed === 'object').toBe(true)
	})
	it('returns playwright version', async () => {
		const parsed = await getParsedReport()
		expect(parsed.version).toBe('1.37.1')
	})
	it('returns total duration', async () => {
		const parsed = await getParsedReport()
		expect(parsed.duration).toBe(1118.34)
	})
	it('returns workers', async () => {
		const parsed = await getParsedReport()
		expect(parsed.workers).toBe(5)
	})
	it('returns shards', async () => {
		const parsed = await getParsedReport()
		expect(parsed.shards).toBe(2)
	})
	it('returns files', async () => {
		const parsed = await getParsedReport()
		expect(parsed.files.length).toBe(4)
	})
	it('returns suites', async () => {
		const parsed = await getParsedReport()
		expect(parsed.suites.length).toBe(4)
	})
	it('returns specs', async () => {
		const parsed = await getParsedReport()
		expect(parsed.specs.length).toBe(14)
	})
	it('counts tests', async () => {
		const parsed = await getParsedReport()
		expect(parsed.tests.length).toBe(14)
		expect(parsed.failed.length).toBe(2)
		expect(parsed.passed.length).toBe(10)
		expect(parsed.flaky.length).toBe(1)
		expect(parsed.skipped.length).toBe(1)
	})
	it('counts sharded tests', async () => {
		const parsed = await getParsedShardedReport()
		expect(parsed.tests.length).toBe(27)
		expect(parsed.failed.length).toBe(1)
		expect(parsed.passed.length).toBe(22)
		expect(parsed.flaky.length).toBe(1)
		expect(parsed.skipped.length).toBe(3)
	})
})

describe('renderReportSummary', () => {
	const renderOptions = {
		title: 'Test Report',
		reportUrl: 'https://example.com/report',
		commit: '1234567'
	}
	const getReportSummary = async () =>
		renderReportSummary(parseReport(await getReport()), renderOptions)
	it('returns a string', async () => {
		const summary = await getReportSummary()
		expect(typeof summary === 'string').toBe(true)
	})
	it('matches snapshot', async () => {
		const summary = await getReportSummary()
		expect(summary).toMatchSnapshot()
	})
})
