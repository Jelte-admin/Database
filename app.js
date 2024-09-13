// Event listener for adding a user
document.getElementById('addUserForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // Log the variables in the console
    console.log('Name:', name);
    console.log('Email:', email);

    try {
        // Send data to the server using fetch API
        const response = await fetch('http://localhost:3000/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        });

        if (response.ok) {
            alert('User added successfully!');
            document.getElementById('addUserForm').reset(); // Clear the form
        } else {
            alert('Error adding user.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the user.');
    }
});

// Event listener for toggling user status
document.getElementById('statusButton').addEventListener('click', async () => {
    const name = document.getElementById('nameInput').value;
    console.log('Toggling status for:', name); // Debugging line

    try {
        const response = await fetch(`http://localhost:3000/toggle-status?name=${name}`);
        console.log('Response:', response); // Debugging line

        if (response.ok) {
            fetchData(); // Refresh data to show updated status
        } else {
            alert('Error toggling status.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while toggling status.');
    }
});

// API Endpoint to toggle boolean
app.get('/toggle-status', (req, res) => {
    const userId = 2; // You can change this to dynamic input if needed
    connection.query('UPDATE users SET isActive = 1 WHERE id = ?', [userId], (error, results) => {
      if (error) {
        console.error('Error updating boolean:', error);
        return res.status(500).send('Error updating boolean');
      }
      res.status(200).send('Boolean updated successfully!');
    });
  });
  