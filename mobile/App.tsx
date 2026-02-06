import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { addExpense, getExpenses, deleteExpense, Expense } from "./src/services/api/expenses";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CATEGORY_EMOJIS: Record<string, string> = {
  "Food & Dining": "🍔",
  "Transport": "🚗",
  "Shopping": "🛒",
  "Entertainment": "📺",
  "Bills & Utilities": "📄",
  "Health": "💊",
  "Travel": "✈️",
  "Other": "📦",
};

export default function App() {
  const [input, setInput] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadExpenses = async () => {
    try {
      setRefreshing(true);
      const data = await getExpenses();
      setExpenses(data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const expense = await addExpense(input);
      setExpenses(prev => [expense, ...prev]);
      setInput("");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Delete this expense?", "", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteExpense(id);
            setExpenses(prev => prev.filter(e => e.id !== id));
          } catch (err: any) {
            Alert.alert("Error", err.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.item}>
      <Text style={styles.category}>{CATEGORY_EMOJIS[item.category] ?? "📦"} {item.category}</Text>
      <Text style={styles.amount}>₹{item.amount}</Text>
      <Text style={styles.description}>{item.description}{item.merchant ? ` at ${item.merchant}` : ""}</Text>
      <Text style={styles.time}>{dayjs(item.created_at).fromNow()}</Text>
      <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>AI Expense Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Spent 500 on groceries at BigBazaar"
        value={input}
        onChangeText={setInput}
      />
      <Button title={loading ? "Adding..." : "Add Expense"} onPress={handleAdd} disabled={loading} />
      <FlatList
        data={expenses}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={loadExpenses}
        ListEmptyComponent={<Text style={{ marginTop: 20 }}>No expenses yet. Add your first one!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, marginBottom: 8 },
  item: { borderWidth: 1, borderColor: "#eee", padding: 12, marginBottom: 8, borderRadius: 8 },
  category: { fontWeight: "bold" },
  amount: { fontWeight: "bold", fontSize: 16, marginTop: 4 },
  description: { color: "#555", marginTop: 2 },
  time: { color: "#999", fontSize: 12, marginTop: 2 },
});
