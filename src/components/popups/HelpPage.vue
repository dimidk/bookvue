<script setup>

import { ref,reactive, onMounted } from 'vue';


const dialog = ref(null);

const openDialog = () => {
    
    dialog.value.showModal();
  };

  const closeDialog = () => {

    if (dialog.value)
      dialog.value.close();

  };

  function contactSupport() {
    window.location.href = 'mailto:support@example.com'
  }

  defineExpose({openDialog,closeDialog});


</script>
<template>
    <dialog ref="dialog" @click="closeDialog">
        <div class="help-container">
        <h1 class="title">Βοήθεια - Οδηγίες Χρήσης</h1>
    
        <section class="section">
            <h2>Συχνές Ερωτήσεις</h2>
            <ul>
            <li><strong>Q:</strong> <u>Πώς επιλέγω ώρα και ημέρα για την κράτηση ενός εργαστηρίου;</u><br /><strong>A:</strong> Χρησιμοποιώντας το ποντίκι μπορείτε να κάνετε κλικ στην ημέρα και ώρα που θέλετε 
                και κρατάτε το ποντίκι πατημένο μέχρι την ώρα λήξης της κράτησης. Αφήνοντας το ποντίκι εμφανίζεται ένα παράθυρο όπου δίνεται περισσότερες πληροφορίες σχετικά με την κράτηση 
                του εργαστηρίου. </li>
            <!-- <li><strong>Q:</strong> How can I contact support?<br /><strong>A:</strong> Email us at <a href="mailto:support@example.com">support@example.com</a>.</li> -->
            <li><strong>Q:</strong> <u>Μπορώ να κάνω επαναλαμβανόμενη μαζική κράτηση ενός εργαστηρίου, συγκεκριμένη μέρα και ώρα κάθε εβδομάδα;</u><br />
                <strong>A:</strong> Ναι, μπορείτε. Αν κάνετε κλικ στην <i>Νέα Κράτηση</i> εμφανίζεται νέο παράθυρο όπου μπορείτε να κάνετε check την επιλογή <i>Εβδομαδιαία Επανάληψης Κράτησης</i>
                και να δηλώσετε τις ημέρες όπου θέλετε να γίνει κράτηση του εργαστηρίου στην ώρα που έχετε επιλέξει για όσες εβδομάδες θέλετε δηλώνοντας και την τελευταία 
                εβδομάδα όπου θέλετε το Εργαστήριο.</li>
            <li><strong>Q:</strong> <u>Έκανα μια Κράτηση κατα λάθος ή δεν την χρειάζομαι πια. Μπορώ να την διαγράψω;</u><br />
                <strong>A:</strong> Ναι, μπορείτε. Αν κάνετε κλικ πάνω στην Κράτηση που θέλετε να διαγράψετε, υπάρχει η δυνατότητα της Διαγραφής. Κάνοντας κλικ στη λέξη
                <i>Διαγραφή</i> η κράτηση θα διαγραφεί.</li>
            
            <li><strong>Q:</strong> <u>Δήλωσα λάθος ώρα ή ημέρα στην κράτηση που έκανα. Μπορώ να την αλλάξω;</u><br />
                <strong>A:</strong> Ναι, μπορείτε. Αν κάνετε κλικ πάνω στην Κράτηση που θέλετε να αλλάξετε, έχετε την δυνατότητα να αλλάξετε είτε το θέμα/τίτλο της κράτησης,
                είτε να αλλάξετε την ημέρα που έχει γίνει η κράτηση, είτε την ώρα, αρκεί η νέα ημερομηνία ή η ώρα να μην συμπίπτε με κάποια άλλη ήδη υπάρχουσα κράτηση. Επιλέγοντας
                <i>Update</i> θα γίνει αλλαγή στο πεδίο που επιθυμείτε.</li>
            </ul>
        </section>
    
        <section class="section">
            <h2>Quick Tips</h2>
            <ul>
            <li>💡 Επιλέξτε<i>Νέα Κράτηση</i> αριστερά για να εμφανιστεί αμέσως το παράθυρο για να κάνετε μια νέα κράτηση του εργαστηρίου.</li>
            <!-- <li>💡 Use the search bar to quickly find features.</li> -->
            <li>💡 Αλλάξτε των ώρα μιας κράτησης αυξάνοντας ή μειώνοντας το χρονικό διάστημα με το ποντίκι. Κάνοντας κλικ και μετακινώντας το ποντίκι προς τα κάτω(για αύξηση)
                ή προς τα πάνω (για μείωση) μέχρι την νέα ώρα που επιθυμείτε.</li>
            </ul>
        </section>
    
        <!-- <section class="section contact">
            <h2>Still Need Help?</h2>
            <p>If your issue isn’t listed here, feel free to contact us:</p>
            <button @click="contactSupport">Contact Support</button>
        </section> -->
        </div>
    </dialog>
  </template>
  
  
  <style scoped>
  .help-container {
    max-width: 800px;
    margin: auto;
    padding: 2rem;
    font-family: Arial, sans-serif;
  }
  
  .title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .section {
    margin-bottom: 2rem;
  }
  
  .section h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  ul {
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  .contact button {
    padding: 0.5rem 1rem;
    background-color: #2d72d9;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .contact button:hover {
    background-color: #1a52a2;
  }
  </style>
  