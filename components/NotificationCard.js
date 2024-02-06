import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card, { colors } from './shared/Card';
import Hr from './shared/Hr';
import { useAppStateContext } from '../store/context';

function NotificationCard({ data }) {
  // console.log('@NotificationCard -- data', data);
  const { variant, NotificationTitle, icon } = getVariant(data.state);
  // console.log('@NotificationCard -- variant', variant);
  // console.log('@NotificationCard -- colors', colors[variant]);

  return (
    <Card variant={variant}>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={colors[variant].fill}
          />
          <Text
            style={{
              marginStart: 5,
              fontSize: 20,
              fontWeight: 'bold',
              lineHeight: 25,
              color: colors[variant].fill,
            }}
          >
            {NotificationTitle}
          </Text>
        </View>
        <Description variant={variant} data={data} />
      </View>
    </Card>
  );
}

export default NotificationCard;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // flex: 1,
  },

  text: {
    fontSize: 14,
    lineHeight: 16,
  },

  heading: {
    fontSize: 16,
    lineHeight: 20,
  },

  bold: {
    fontWeight: 'bold',
  },
});

export const getVariant = (inCase) => {
  if (inCase === 'success')
    return {
      variant: 'success',
      NotificationTitle: 'Success!',
      icon: 'message-arrow-right-outline',
    };
  if (inCase === 'failure')
    return {
      variant: 'danger',
      NotificationTitle: 'Failed!',
      icon: 'message-alert-outline',
    };
  if (inCase === 'inProgress')
    return {
      variant: 'warning',
      NotificationTitle: 'In progress',
      icon: 'message-badge-outline',
    };
  return {
    variant: 'primary',
    NotificationTitle: 'Scheduled',
    icon: 'message-text-clock-outline',
  };
};

const Description = ({ variant, data }) => {
  // query to get message info, as the messages are loaded in the global app state the required message will be selected from the state

  const { state } = useAppStateContext();
  const message = state.messages.find((el) => el.id === data.messageId);
  const contacts = message?.recipients
    ?.map((el) => el.name || 'no-name')
    .join(', ');

  const styleText = {
    fontSize: 14,
    lineHeight: 18,
    color: colors[variant].fill,
  };

  if (variant === 'success')
    return (
      <>
        <View
        // style={{ flex: 1 }}
        >
          <Text style={[styleText, styles.heading]}>
            <Text style={styles.bold}>{message.title}</Text>You clicked the
            notification and got directed to sms messenger app successfully
          </Text>
        </View>

        <View style={{ flex: 0.1 }}>
          <Hr color={colors[variant].border} marginV={8} />
          <Text style={styleText}>Sent on: {data.sentOn.toLocaleString()}</Text>
          <Text style={styleText}>To: {contacts || 'no name'}</Text>
        </View>
      </>
    );

  if (variant === 'danger')
    return (
      <>
        <Text style={[styleText, styles.heading]}>
          <Text style={styles.bold}>{message.title}</Text> was not sent. Error
          occurred while sending!
        </Text>
        <Hr color={colors[variant].border} marginV={8} />
        <Text style={styleText}>On: {data.sentOn.toLocaleString()}</Text>
        <Text style={styleText}>To: {contacts || 'no name'}</Text>
      </>
    );

  if (variant === 'inProgress')
    return (
      <>
        <Text style={[styleText, styles.heading]}>
          <Text style={styles.bold}>{message.title}</Text> needs your permission
          to be sent, press on me to proceed.
        </Text>
        <Hr color={colors[variant].border} marginV={8} />
        <Text style={styleText}>Sent on: {data.sentOn.toLocaleString()}</Text>
        <Text style={styleText}>To: {contacts || 'no name'}</Text>
      </>
    );

  return (
    <>
      <Text style={[styleText, styles.heading]}>
        <Text style={styles.bold}>{message.title}</Text> is scheduled to be sent
        later, when it's time to send you will be notified to send the message.
      </Text>
      <Hr color={colors[variant].border} marginV={8} />

      <Text style={styleText}>
        Scheduled on: {data.sentOn.toLocaleString()}
      </Text>
      <Text style={styleText}>To: {contacts || 'no name'}</Text>
    </>
  );
};
