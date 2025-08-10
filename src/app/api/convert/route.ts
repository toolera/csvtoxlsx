import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const fileContent = await file.text()

    const parsedData = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    })

    if (parsedData.errors.length > 0) {
      return NextResponse.json({ error: 'Failed to parse CSV' }, { status: 400 })
    }

    const worksheet = XLSX.utils.json_to_sheet(parsedData.data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    const headers = new Headers()
    headers.set('Content-Disposition', `attachment; filename="${file.name.replace('.csv', '.xlsx')}"`)
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    return new NextResponse(buffer, { headers })
  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}