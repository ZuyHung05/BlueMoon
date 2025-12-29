// Fetch households from backend API
const fetchHouseholds = async () => {
    setLoading(true);
    try {
        const requestBody = {
            searchKeyword: searchTerm || null,
            status: statusFilter === 'ALL' ? null : parseInt(statusFilter)
        };

        const response = await fetch('http://localhost:8080/household/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            // Handle 404 (no results found)
            if (response.status === 404) {
                setHouseholds([]);
                return;
            }
            throw new Error('Failed to fetch households');
        }

        const result = await response.json();
        const householdsData = result.result;

        // Map backend response to frontend format
        const mappedData = householdsData.map((item) => ({
            household_id: item.householdId,
            apartment_id: item.householdId, // Using householdId as room number
            head_of_household: item.headOfHouseholdName,
            status: parseInt(item.status),
            start_day: item.startDay,
            members: Array(item.memberCount).fill({}) // Create array with memberCount length
        }));

        setHouseholds(mappedData);
    } catch (error) {
        console.error('Error fetching households:', error);
        setSnackbar({ open: true, message: 'Lỗi khi tải dữ liệu hộ khẩu!', severity: 'error' });
        setHouseholds([]);
    } finally {
        setLoading(false);
    }
};

// Fetch data when component mounts or filters change
useEffect(() => {
    fetchHouseholds();
}, [searchTerm, statusFilter]);
