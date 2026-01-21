
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data.json');

try {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const attendance = data.attendance || [];

    console.log(`Original attendance records: ${attendance.length}`);

    const uniqueMap = new Map();

    // Process records
    // We want to keep the LATEST record if there are duplicates for the same student and date.
    // The records seem to have IDs with timestamps or just be appended in order.
    // Assuming later in array = newer, or we can check ID content if it has timestamp.
    // The IDs are like "att-1767942132045". The number is a timestamp.

    attendance.forEach(record => {
        const key = `${record.studentId}-${record.date}`; // Key by student and date
        const existing = uniqueMap.get(key);

        if (!existing) {
            uniqueMap.set(key, record);
        } else {
            // Compare IDs to find newer one? Or just trust array order (last is newest)?
            // Let's parse timestamp from ID to be safe.
            const getTs = (id) => {
                if (!id) return 0;
                const parts = id.split('-');
                return parts.length > 1 ? parseInt(parts[1]) : 0;
            };

            const existingTs = getTs(existing.id);
            const currentTs = getTs(record.id);

            if (currentTs > existingTs) {
                uniqueMap.set(key, record);
            }
        }
    });

    const uniqueAttendance = Array.from(uniqueMap.values());
    console.log(`Unique attendance records: ${uniqueAttendance.length}`);

    data.attendance = uniqueAttendance;

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    console.log('Successfully updated data.json');

} catch (error) {
    console.error('Error processing file:', error);
}
