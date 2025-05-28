import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { app } from './firebase.js';

const db = getFirestore(app);
const veteransCollection = collection(db, 'veterans');

// Create a new veteran
export const createVeteran = async (veteranData) => {
    try {
        const docRef = await addDoc(veteransCollection, {
            ...veteranData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error adding veteran:', error);
        throw error;
    }
};

// Get all veterans
export const getVeterans = async () => {
    try {
        const q = query(veteransCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting veterans:', error);
        throw error;
    }
};

// Update a veteran
export const updateVeteran = async (id, veteranData) => {
    try {
        const veteranRef = doc(db, 'veterans', id);
        await updateDoc(veteranRef, {
            ...veteranData,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Error updating veteran:', error);
        throw error;
    }
};

// Delete a veteran
export const deleteVeteran = async (id) => {
    try {
        const veteranRef = doc(db, 'veterans', id);
        await deleteDoc(veteranRef);
    } catch (error) {
        console.error('Error deleting veteran:', error);
        throw error;
    }
};

// Search veterans
export const searchVeterans = async (searchTerm) => {
    try {
        const q = query(
            veteransCollection,
            where('name', '>=', searchTerm),
            where('name', '<=', searchTerm + '\uf8ff')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error searching veterans:', error);
        throw error;
    }
};
