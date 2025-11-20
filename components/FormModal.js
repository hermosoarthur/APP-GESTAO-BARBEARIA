import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const FormModal = ({ 
  visible, 
  title, 
  fields, 
  onSubmit, 
  onCancel,
  theme 
}) => {
  const styles = createStyles(theme);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          
          {fields.map((field, index) => (
            <TextInput
              key={index}
              style={[
                styles.modalInput,
                field.multiline && { height: 80, textAlignVertical: 'top' }
              ]}
              placeholder={field.placeholder}
              placeholderTextColor={theme.colors.textSecondary}
              value={field.value}
              onChangeText={field.onChange}
              keyboardType={field.keyboardType || 'default'}
              multiline={field.multiline}
            />
          ))}

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton]} 
              onPress={onSubmit}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: theme.colors.border
  },
  saveButton: {
    backgroundColor: theme.colors.primary
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontWeight: '600'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600'
  }
});

export default FormModal;