import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card, { colors } from './shared/Card';
import Hr from './shared/Hr';

function NotificationCard({ data }) {
  // console.log('@NotificationCard -- data', data);
  const { variant, NotificationTitle, icon } = getVariant(data.state);
  // console.log('@NotificationCard -- variant', variant);
  // console.log('@NotificationCard -- colors', colors[variant]);

  return (
    <Card variant={variant}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={colors[variant].fill}
        />
        <Text
          style={{
            marginStart: 5,
            fontSize: 24,
            fontWeight: 'bold',
            lineHeight: 30,
            color: colors[variant].fill,
          }}
        >
          {NotificationTitle}
        </Text>
      </View>
      <Description variant={variant} data={data} />
    </Card>
  );
}

export default NotificationCard;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  text: {
    fontSize: 16,
    lineHeight: 20,
  },

  heading: {
    fontSize: 18,
    lineHeight: 22,
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
  if (inCase === 'fail')
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
  // query to get message info
  const msgInfo = {
    contactName: data.messageId + '--Name',
    contactNumber: data.messageId + '--Number',
  };

  const styleText = {
    fontSize: 16,
    lineHeight: 20,
    color: colors[variant].fill,
  };

  if (variant === 'success')
    return (
      <>
        <Text style={[styleText, styles.heading]}>
          <Text style={styles.bold}>{data.messageTitle}</Text> was sent
          successfully
        </Text>
        <Hr color={colors[variant].border} marginV={8} />
        <Text style={styleText}>Sent on: {data.sentOn}</Text>
        <Text style={styleText}>To: {msgInfo.contactName}</Text>
      </>
    );

  if (variant === 'fail')
    return (
      <>
        <Text style={[styleText, styles.heading]}>
          <Text style={styles.bold}>{data.messageTitle}</Text> was not sent.
          Error occurred while sending!
        </Text>
        <Hr color={colors[variant].border} marginV={8} />
        <Text style={styleText}>On: {data.sentOn}</Text>
        <Text style={styleText}>To: {msgInfo.contactName}</Text>
      </>
    );

  if (variant === 'inProgress')
    return (
      <>
        <Text style={[styleText, styles.heading]}>
          <Text style={styles.bold}>{data.messageTitle}</Text> needs your
          permission to be sent, press on me to proceed.
        </Text>
        <Hr color={colors[variant].border} marginV={8} />
        <Text style={styleText}>Sent on: {data.sentOn}</Text>
        <Text style={styleText}>To: {msgInfo.contactName}</Text>
      </>
    );

  return (
    <>
      <Text style={[styleText, styles.heading]}>
        <Text style={styles.bold}>{data.messageTitle}</Text> is scheduled to be
        sent later, when it's time to send you will be notified to send the
        message.
      </Text>
      <Hr color={colors[variant].border} marginV={8} />

      <Text style={styleText}>Scheduled on: {data.sentOn}</Text>
      <Text style={styleText}>To: {msgInfo.contactName}</Text>
    </>
  );
};
